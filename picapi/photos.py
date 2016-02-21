
import bottle, exifread
from PIL import Image
from bottle import response, request
import os, json, sys, sqlite3, datetime, time, string, random
from os import listdir
from os.path import isfile, isdir, join

import gevent
import gevent.queue
from time import sleep

from . import config, database, storages, plugins, permissions

from .app import app, success, error





def uid(length = 30):
	s = string.ascii_lowercase+string.digits
	return ''.join(random.SystemRandom().choice(s) for i in range(length))




def preparePhoto(photo):
	if 'o_secret' not in photo: photo['o_secret'] = None
	data = {
		'id'  : photo['id'],
		'title': photo['title'],
		'url_info' : storages.stores[photo['storage']].url_info(
			photo['id'],
			photo['secret'], 
			photo['o_secret'], 
			photo['extension'])
	}

	return data

def get(id=None):
	db = database.connect()
	if id:
		photo = db.execute("SELECT * FROM photos where id=:id", {'id':id}).fetchone()
		return success(preparePhoto(dict(photo)))

	photos = db.execute("SELECT id, title, secret, extension, storage FROM photos").fetchall()
	db.close()
	return success([preparePhoto(dict(row)) for row in photos])

def delete(id):	

	if not isinstance(id, list):
		id = [id]


	db = database.connect()		
	curSelect = db.execute("SELECT id, secret, o_secret, extension, storage FROM photos WHERE id IN ({0})".format(', '.join('?' for _ in id)), id)


	for row in curSelect:
		storages.stores[row['storage']].delete(row['id'], row['secret'], row['o_secret'], row['extension'])

	curDelete = db.execute("DELETE FROM photos WHERE id IN ({0})".format(', '.join('?' for _ in id)), id)
	db.commit()
	db.close()
	return success({'rowcount':curDelete.rowcount})

def get_xmptags(file):
	tags = []
	img = file.read()
	imgAsString=str(img)
	xmp_start = imgAsString.find('<digiKam:TagsList>')
	xmp_end = imgAsString.find('</digiKam:TagsList>')
	if xmp_start != xmp_end:
		xmpString = '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description xmlns:digiKam="http://www.digikam.org/ns/1.0/" >'+					imgAsString[xmp_start:xmp_end+19]+'</rdf:Description></rdf:RDF>'
		import xml.etree.ElementTree as ET
		import xml

		root = ET.fromstring(xmpString)[0][0][0]
		for child in root:
			text = child.text.encode("latin1").decode("unicode_escape").encode("latin1").decode("utf-8")
			if '/' in text:
				text = text.split('/')[-1]
			tags.append(text)
	file.seek(0)
	return tags

def get_exif(file):

	metadata={}
	exif_tags = exifread.process_file(file)

	tag_list = {
		'DateTimeOriginal'    : 'EXIF DateTimeOriginal',
		'ExposureTime'        : 'EXIF ExposureTime',
		'FocalLength'         : 'EXIF FocalLength',
		'FNumber'             : 'EXIF FNumber',
		'Model'               : 'Image Model',
		'ISOSpeedRatings'     : 'EXIF ISOSpeedRatings',
		'Make'                : 'Image Make',
		'Flash'               : 'EXIF Flash',
		'ExposureProgram'     : 'EXIF ExposureProgram',
		'Rating'              : 'Image Rating'
		}
	for key, val in tag_list.items():
		if val in exif_tags: metadata[key] = str(exif_tags[val])
	file.seek(0)
	return metadata


def add(filename, storage='local', storage_options=None, file = None):
	"""
		Adds a photo to the library.

		:param filename: the name of the photo including its extension
		:param storage_options: (optionaly) options given to the storage that may help him to save the file
		:param file: (optionaly) the open file(-like) or BytesIO storing the photo. It must implement the method seek, tell and read.
		:type filename: string 
		:type save: function
		:type file: file(-like) or BytesIO Object
		:return: the id of the photo
		:rtype: int
	"""
	title, ext  = os.path.splitext(filename)
	ext = ext.lower()
	if ext not in config.Config.AllowedExtensions:
		return error('File extension not allowed')

	tags = []
	metadata={}
	year, month = 0, 0
	width, height = 0, 0
	filesize = 0
	rating = None
	captured_on = created_on = int(time.time())
	if file:
		im = Image.open(file)
		width, height = im.size

		file.seek(0,2)
		filesize = file.tell()
		file.seek(0)

		tags = get_xmptags(file)
		metadata = get_exif(file)
		if 'DateTimeOriginal' in metadata:
			d, t = metadata['DateTimeOriginal'].split(' ')
			year, month, day = [int(i) for i in d.split(':')]
			hour, minute, second = [int(i) for i in t.split(':')]
			captured_on = datetime.datetime(year, month, day, hour, minute, second).timestamp()
		if 'Rating' in metadata: rating = metadata['Rating']

	

	secret = uid()
	o_secret = uid()
	value = {
		'secret'        : secret,
		'o_secret'      : o_secret,
		'title'         : title,
		'ext'           : ext,
		'filesize'      : filesize,
		'width'         : width,
		'height'        : height,
		'metadata'      : json.dumps(metadata),
		'captured_on'   : captured_on,
		'captured_year' : year,
		'captured_month': month,
		'created_on'    : created_on,
		'modified_on'   : created_on,
		'rating'        : rating
	}


	db = database.connect()
	cursor = db.cursor()
	cursor.execute("""INSERT INTO photos 
		(secret, o_secret, title, extension, filesize, width, height, captured_on, captured_year, captured_month, created_on, modified_on, rating, metadata) VALUES 
		(:secret, :o_secret, :title, :ext, :filesize, :width, :height, :captured_on, :captured_year, :captured_month, :created_on, :modified_on, :rating, :metadata )""", value)

	id = cursor.lastrowid
	if storages.stores[storage].save(id, secret, o_secret, ext, options=storage_options):
		db.commit()
		db.close()
		return id
	else:
		db.close()
		return False
	



@app.route('/o_static/<filename>', skip=[plugins.pluginWrapper])
def route_o_static(filename):
	return bottle.static_file(filename, root=config.Path.Uploads)

@app.route('/static/<filename>', skip=[plugins.pluginWrapper])
def route_static(filename):
	return bottle.static_file(filename, root=config.Path.CachePhotos)


@app.route('/photos')
def route_photos():
	return get()

@app.route('/photos/<id>')
def route_photo(id):
	return get(id)


@app.route('/photos/<id>', method='DELETE')
def route_delete(id):
	if ',' in id:
		return delete(id.split(','))

	return delete(id)


@app.route('/photos', method='OPTIONS')
def route_options_upload():
	return success()


@app.route('/photos', method='POST')
def route_post_upload():
	upload     = bottle.request.files.get('upload')

	def save(filepath, filename):
		upload.filename = filename
		upload.save(filepath)
		return True
		
	id = add(upload.filename, file=upload.file, storage='local', storage_options={'save':save})
	if not id:
		return error()
	return success({'id': id})



