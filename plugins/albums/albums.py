import time


from bottle import request

from plugins import add_hook
from app import app, success


import models, database

class Album():

	def get(self, id=None):
		db = database.connect()
		if id:
			album = db.execute("SELECT * FROM albums where id=:id", {'id':id}).fetchone()
			return success(dict(album))

		albums = db.execute("SELECT * FROM albums").fetchall()
		print(albums)
		db.close()
		return success([dict(a) for a in albums])


	def photos(self, id):
		db = database.connect()
		cur = db.execute("""SELECT photos.* FROM albums 
			INNER JOIN albums_photos AS r ON r.album_id = albums.id
			INNER JOIN photos             ON r.photo_id = photos.id
			WHERE albums.id=:id""", {'id':id}).fetchall()
		db.close()
		return success([models.Photo().preparePhoto(dict(a)) for a in cur])

	def photosAlbums(self, id):
		db = database.connect()
		cur = db.execute("""SELECT albums.name, albums.id FROM albums 
			INNER JOIN albums_photos AS r ON r.album_id = albums.id
			INNER JOIN photos             ON r.photo_id = photos.id
			WHERE photos.id=:id""", {'id':id}).fetchall()
		db.close()
		return success([dict(a) for a in cur])

	def add(self, name):
		created_on = int(time.time())
		value = {
			'name'       : name,
			'created_on' : created_on,
			'modified_on': created_on
		}
		db = database.connect()
		cur = db.execute("INSERT INTO albums (name, created_on, modified_on) VALUES (:name, :created_on, :modified_on)", value)
		db.commit()
		db.close()
		return success({'id': cur.lastrowid})

	def add_photo(self, album_id, photo_id):
		db = database.connect()
		cur = db.execute("INSERT INTO albums_photos (album_id, photo_id) VALUES (:album_id, :photo_id)", 
			{
				'album_id': album_id,
				'photo_id': photo_id
			})
		db.commit()
		db.close()
		return success()



@app.route('/albums')
def albums():

	return Album().get()

@app.route('/albums/<id:int>')
def albumsById(id):

	return Album().get(id)

@app.route('/albums/<id:int>/photos')
def albumsById(id):

	return Album().photos(id)

@app.route('/photos/<id:int>/albums')
def albumsByPhotos(id):

	return Album().photosAlbums(id)

@app.route('/albums', method='POST')
def albumsPost():

	return Album().add(request.params['name'])

@app.route('/albums/<id:int>/photos', method='POST')
def albumsPhotosPost(id):

	return Album().add_photo(id, request.params['photo_id'])

