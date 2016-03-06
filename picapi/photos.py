
import bottle, exifread
from PIL import Image, ImageOps
from bottle import response, request
import os, json, sys, sqlite3, datetime, time, string, random, io
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
	attachments = '{}'
	if 'attachments' in photo and photo['attachments']: attachments = photo['attachments']
	attachments = json.loads(attachments)
	for i in attachments:
		attachments[i] = storages.stores[photo['storage']].url(str(photo['id'])+'_'+attachments[i], type='attachment')

	url_info = {
		'base': storages.stores[photo['storage']].url(str(photo['id'])+'_'+photo['secret'],type='thumbnail'),
		'extension': photo['extension']
	}
	if photo['o_secret']:
		url_info['original'] = storages.stores[photo['storage']].url(str(photo['id'])+'_'+photo['secret']+'_'+photo['o_secret']+photo['extension'],type='photo')
	data = {
		'id'  : photo['id'],
		'title': photo['title'],
		'attachments': attachments,
		'url_info' : url_info
	}

	return data

def update(id):

	query = ''
	value = {'id': id}

	acceptedFields = ['title']

	for i in acceptedFields:
		if i in request.params: 
			value[i] = request.params[i]
			query += "SET "+i+" = :"+i

	if len(query) == 0:
		return error('no data sent (accepted fields: '+(','.join(acceptedFields))+')')

	db = database.connect()

	query = "UPDATE photos "+query+" WHERE id = :id"
	cur = db.execute(query, value)

	db.commit()
	db.close()
	return success()
def get(id=None):
	db = database.connect()
	if id:
		photo = db.execute("SELECT * FROM photos where id=:id", {'id':id}).fetchone()
		return success(preparePhoto(dict(photo)))

	photos = db.execute("SELECT id, title, secret, extension, storage, attachments FROM photos").fetchall()
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

def date_time_to_timestamp(dateTime):
	d, t = dateTime.split(' ')
	year, month, day = [int(i) for i in d.split(':')]
	hour, minute, second = [int(i) for i in t.split(':')]
	return datetime.datetime(year, month, day, hour, minute, second).timestamp()

def save_photo_and_thhumbnails(file, id, secret, o_secret, ext, content_type=None):

	o_filename = str(id) + '_' + secret + '_' + o_secret + ext

	basename = str(id) + '_' + secret

	storages.save(file, o_filename, type='photo', content_type=content_type)
	im = Image.open(file)
	bio = io.BytesIO()
	if max(im.size) > 2048:
		im.thumbnail([2048,2048], Image.ANTIALIAS)
		im.save(bio, "JPEG")
		bio.seek(0)
		storages.save(bio, basename+'_k'+ext, 'thumbnail', content_type='image/jpeg')
		bio = io.BytesIO()

	thumb = ImageOps.fit(im, [75,75], Image.ANTIALIAS)
	thumb.save(bio, "JPEG")
	bio.seek(0)
	storages.save(bio, basename+'_s'+ext, 'thumbnail', content_type='image/jpeg')
	bio = io.BytesIO()

	thumb = ImageOps.fit(im, [150,150], Image.ANTIALIAS)
	thumb.save(bio, "JPEG")
	bio.seek(0)
	storages.save(bio, basename+'_q'+ext, 'thumbnail', content_type='image/jpeg')
	bio = io.BytesIO()
	

	im2 = im.copy()
	im2.thumbnail([1600,1600], Image.ANTIALIAS)
	im2.save(bio, "JPEG")
	bio.seek(0)
	storages.save(bio, basename+'_h'+ext, 'thumbnail', content_type='image/jpeg')
	bio = io.BytesIO()

	im = im.copy()
	im.thumbnail([1024,1024], Image.ANTIALIAS)
	im.save(bio, "JPEG")
	bio.seek(0)
	storages.save(bio, basename+'_b'+ext, 'thumbnail', content_type='image/jpeg')
	bio = io.BytesIO()

	im2 = im.copy()
	im2.thumbnail([800,800], Image.ANTIALIAS)
	im2.save(bio, "JPEG")
	bio.seek(0)
	storages.save(bio, basename+'_c'+ext, 'thumbnail', content_type='image/jpeg')
	bio = io.BytesIO()

	im2 = im.copy()
	im2.thumbnail([640,640], Image.ANTIALIAS)
	im2.save(bio, "JPEG")
	bio.seek(0)
	storages.save(bio, basename+'_z'+ext, 'thumbnail', content_type='image/jpeg')
	bio = io.BytesIO()

	im2 = im.copy()
	im2.thumbnail([500,500], Image.ANTIALIAS)
	im2.save(bio, "JPEG")
	bio.seek(0)
	storages.save(bio, basename+ext, 'thumbnail', content_type='image/jpeg')
	bio = io.BytesIO()

	im2 = im.copy()
	im2.thumbnail([320,320], Image.ANTIALIAS)
	im2.save(bio, "JPEG")
	bio.seek(0)
	storages.save(bio, basename+'_n'+ext, 'thumbnail', content_type='image/jpeg')
	bio = io.BytesIO()

	im2 = im.copy()
	im2.thumbnail([240,240], Image.ANTIALIAS)
	im2.save(bio, "JPEG")
	bio.seek(0)
	storages.save(bio, basename+'_m'+ext, 'thumbnail', content_type='image/jpeg')
	bio = io.BytesIO()
	return True


def add(filename, storage=None, storage_options=None, file = None, content_type=None):
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
	if storage == None:
		storage = storages.defaultStore
		
	title, ext  = os.path.splitext(filename)
	ext = ext.lower()
	if ext not in config.Config.AllowedExtensions:
		ret = plugins.run_hook('handle_file_upload', False, filename=filename, storage=storage, storage_options=storage_options, file=file)
		if ret:
			return ret
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
			captured_on = date_time_to_timestamp(metadata['DateTimeOriginal'])
		if 'Rating' in metadata: rating = metadata['Rating']

	

	secret = uid()
	o_secret = uid()
	value = {
		'secret'        : secret,
		'o_secret'      : o_secret,
		'title'         : title,
		'extension'           : ext,
		'filesize'      : filesize,
		'width'         : width,
		'height'        : height,
		'metadata'      : json.dumps(metadata),
		'captured_on'   : captured_on,
		'captured_year' : year,
		'captured_month': month,
		'created_on'    : created_on,
		'modified_on'   : created_on,
		'rating'        : rating,
		'storage'		: storage
	}


	db = database.connect()
	cursor = db.cursor()
	cursor.execute("""INSERT INTO photos 
		(secret, o_secret, title, extension, filesize, width, height, captured_on, captured_year, captured_month, created_on, modified_on, rating, metadata, storage) VALUES 
		(:secret, :o_secret, :title, :extension, :filesize, :width, :height, :captured_on, :captured_year, :captured_month, :created_on, :modified_on, :rating, :metadata, :storage )""", value)

	id = cursor.lastrowid
	if save_photo_and_thhumbnails(file, id, secret, o_secret, ext, content_type=content_type):
		db.commit()
		db.close()
		value['id'] = id
		return preparePhoto(value)
	else:
		db.close()
		return False
	


@app.route('/static_attachement/<filename>', skip=[plugins.pluginWrapper])
def route_static_attachments(filename):
	response.set_header('Content-Type', 'application/octet-stream');
	response.set_header('Content-Disposition', 'attachment; filename="' + filename + '"');
	print('download', filename, isfile(join(config.Path.Attachments, filename)))
	return open(join(config.Path.Attachments, filename), 'rb')

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

@app.route('/photos/<id>', method='PUT')
def route_put_photo(id):
	return update(id)

@app.route('/photos/<id>', method='DELETE')
def route_delete(id):
	if ',' in id:
		return delete(id.split(','))

	return delete(id)


@app.route('/photos/<id>', method='OPTIONS')
@app.route('/photos', method='OPTIONS')
def route_options_upload(id=0):
	response.set_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT')
	return success()


@app.route('/photos', method='POST')
def route_post_upload():
	upload     = bottle.request.files.get('upload')

	photo = add(upload.filename, file=upload.file, content_type=upload.content_type)
	if not photo:
		return error()
	return success(photo)




