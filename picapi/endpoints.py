import bottle
from bottle import response, request
import os, json, sys, sqlite3
from os import listdir
from os.path import isfile, isdir, join

import gevent
import gevent.queue
from time import sleep

import config,  models, plugins, permissions

from app import app, success, error




@app.route('/o_static/<filename>', skip=[plugins.pluginWrapper])
def o_static(filename):
	return bottle.static_file(filename, root=config.Path.Uploads)

@app.route('/static/<filename>', skip=[plugins.pluginWrapper])
def static(filename):
	return bottle.static_file(filename, root=config.Path.CachePhotos)


@app.route('/photos')
def photos():
	return models.Photo().get()

@app.route('/photos/<id>')
def photo(id):
	return models.Photo().get(id)


@app.route('/photos/<id>', method='DELETE')
def post_upload(id):
	if ',' in id:
		return models.Photo().delete(id.split(','))

	return models.Photo().delete(id)


@app.route('/photos', method='POST')
def post_upload():
	upload     = bottle.request.files.get('upload')

	def save(filepath, filename):
		upload.filename = filename
		upload.save(filepath)
		return True
		
	id = models.Photo().add(upload.filename, file=upload.file, storage='local', storage_options={'save':save})
	if not id:
		return error()
	return success({'id': id})




