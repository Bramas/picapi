#!/usr/local/bin/python
# coding=utf-8

from gevent import monkey; monkey.patch_all()

import bottle

from . import app
app.init()

from . import plugins, config
plugins.init()

from . import storages
storages.init()

from . import photos

def run():
	bottle.run(app=app.app, host=os.environ.get('HOST', 'localhost'), port=os.environ.get('PORT', 8080), debug=True, server='gevent')
