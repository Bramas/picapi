import sqlite3
from os.path import isfile, isdir, join

import config
from app import app

def connect():
	dbfile = join(config.Path.Root, app.config['sqlite.db'])
	db = sqlite3.connect(dbfile)
	db.row_factory = sqlite3.Row
	return db