import time

import os, json, sys, sqlite3, datetime, time, string, random
from os import listdir
from os.path import isfile, isdir, join


from bottle import request, response

from picapi.plugins import add_hook
from picapi.app import app, success, error


from picapi import photos, database, photos, config, storages


def handle_raw_files(alreadyHandled, filename, storage, storage_options, file, **kwargs):
	title, ext  = os.path.splitext(filename)
	ext = ext.lower()
	if ext.lower() != '.pef':
		return alreadyHandled

	exifData = photos.get_exif(file)
	if not 'DateTimeOriginal' in exifData:
		return alreadyHandled

	capturedTime = photos.date_time_to_timestamp(exifData['DateTimeOriginal'])

	db = database.connect()
	with db:		
		row = db.execute("SELECT id, title, attachments FROM photos WHERE captured_on = :capturedTime", {'capturedTime': capturedTime}).fetchone()

		if row == None:
			db.close()
			return alreadyHandled

		row = dict(row)
		if not row['attachments']:
			attachments = {}
		else:
			attachments = json.loads(row['attachments'])
		if not attachments:
			attachments = {}

		filename = photos.uid(30)+ext
		attachments['raw_file'] = filename
		attachments = json.dumps(attachments)

		db.execute('UPDATE photos SET attachments = :attachments WHERE id=:id', {'attachments': attachments, 'id': row['id']})

		if not storages.save(file, str(row['id'])+'_'+filename, type='attachment'):
			db.rollback()
			return alreadyHandled



	return {'id':row['id'],'attachments':{'raw_file': storages.url(str(row['id'])+'_'+filename, type='attachment')}}



add_hook('handle_file_upload', handle_raw_files)