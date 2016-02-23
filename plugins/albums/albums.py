import time


from bottle import request, response

from picapi.plugins import add_hook
from picapi.app import app, success, error


from picapi import photos, database


class Album():

	def smart(self, type):

		db = database.connect()
		cur = db.execute("""SELECT * FROM photos  WHERE id NOT IN (SELECT albums_photos.photo_id FROM albums_photos)""").fetchall()
		db.close()
		return success([photos.preparePhoto(dict(a)) for a in cur])


	def get(self, id=None):
		db = database.connect()
		db.row_factory = database.row_factory(['album', 'cover'])
		if id:
			album = db.execute("SELECT Album.*, '#', Photo.* FROM albums as Album LEFT JOIN photos as Photo ON Album.cover = Photo.id WHERE Album.id=:id", {'id':id}).fetchone()
			print(album)
			item = album['album']
			if album['cover']['id']:
				item['cover'] = photos.preparePhoto(album['cover'])
			return success(item)

		albums = db.execute("SELECT Album.*, '#', Photo.* FROM albums as Album LEFT JOIN photos as Photo ON Album.cover = Photo.id").fetchall()

		db.close()
		data = []
		for album in albums:
			item = album['album']
			if album['cover']['id']:
				item['cover'] = photos.preparePhoto(album['cover'])
			data.append(item)
		data.append({
				'title':'unsorted',
				'id':'unsorted',
				'cover':None
			})

		return success(data)


	def photos(self, id):
		db = database.connect()
		cur = db.execute("""SELECT photos.* FROM albums 
			INNER JOIN albums_photos AS r ON r.album_id = albums.id
			INNER JOIN photos             ON r.photo_id = photos.id
			WHERE albums.id=:id""", {'id':id}).fetchall()
		db.close()
		return success([photos.preparePhoto(dict(a)) for a in cur])

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

	def delete_photo(self, album_id, photo_id):
		db = database.connect()
		cur = db.execute("DELETE FROM albums_photos WHERE album_id = :album_id AND photo_id = :photo_id", 
			{
				'album_id': album_id,
				'photo_id': photo_id
			})
		db.commit()
		db.close()
		return success()

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

@app.route('/albums/<type:re:unsorted>/photos')
def albumsById(type):

	return Album().smart(type)

@app.route('/photos/<id:int>/albums')
def albumsByPhotos(id):

	return Album().photosAlbums(id)

@app.route('/albums', method='POST')
def albumsPost():

	return Album().add(request.params['title'])

@app.route('/albums/<id:int>/photos', method='POST')
def albumsPhotosPost(id):
	if not 'photo_id' in request.params:
		return error(msg='the param \'photo_id\' is missing')
	return Album().add_photo(id, request.params['photo_id'])

@app.route('/albums/<id:int>/photos/<photo_id:int>', method='DELETE')
def albumsPhotosDelete(id, photo_id):
	return Album().delete_photo(id, photo_id)

@app.route('/albums/<id:re:unsorted>/photos/<pid:int>', method='DELETE')
@app.route('/albums/<id:re:unsorted>/photos', method='POST')
@app.route('/albums/<id>/photos/<pid:int>', method='OPTIONS')
@app.route('/albums/<id>/photos', method='OPTIONS')
def albumsPhotosOptions(id, pid=None):
	response.set_header('Access-Control-Allow-Methods', 'GET, POST, DELETE')
	return success()

