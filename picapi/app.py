from bottle import request, response
import bottle.ext.sqlite
import os, json
from os.path import isfile, isdir, join

import config

app = None

def error(msg='unknown', code=500):
	return json.dumps({'error':code, 'message':msg}, ensure_ascii=False)

def success(data=None):
	indent = '  ' if 'indent' in request.params and request.params['indent'] in ('1', 'true') else None

	if data != None:
		return json.dumps(data, ensure_ascii=False, indent=indent)
	return json.dumps({'success':True}, ensure_ascii=False, indent=indent)

def init():
	global app
	app = bottle.Bottle()  
	app.config.load_config(join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))) , 'data', 'picapi.conf'))

	print('load sqlite db ', app.config['sqlite.db'])





