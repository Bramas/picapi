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

	db = database.connect()		
	row = db.execute("SELECT id, title, attachments FROM photos WHERE title = :title", {'title': title}).fetchone()

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


	if not storages.stores[storage].saveAttachment(row['id'], filename, options=storage_options):
		db.rollback()
		db.close()
		return alreadyHandled

	db.commit()
	db.close()

	return {'id':row['id'],'attachments':{'raw_file': storages.stores[storage].urlAttachment(row['id'], filename)}}



add_hook('handle_file_upload', handle_raw_files)