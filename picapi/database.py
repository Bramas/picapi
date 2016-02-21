import sqlite3
from os.path import isfile, isdir, join

from . import config
from .app import app

from collections import namedtuple



def row_factory(tables):
	def namedtuple_factory(cursor, row):
		"""
		Usage:
		con.row_factory = namedtuple_factory
		"""
		data = {}
		for table in tables:
			data[table] = {}
		table_idx = 0
		field_idx = 0
		for col in cursor.description:
			field = col[0]
			if field == "'#'":
				table_idx += 1
			else:
				data[tables[table_idx]][field] = row[field_idx]
			field_idx += 1
		return data
	return namedtuple_factory

def connect():
	dbfile = join(config.Path.Root, app.config['sqlite.db'])
	db = sqlite3.connect(dbfile)
	#db.row_factory = namedtuple_factory
	db.row_factory = sqlite3.Row
	return db