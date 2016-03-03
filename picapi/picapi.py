#!/usr/local/bin/python
# coding=utf-8

from gevent import monkey; monkey.patch_all()

import bottle

from . import app
app.init()

import os
from . import plugins, config
config.init(host=os.environ.get('HOST', 'localhost'), port=os.environ.get('PORT', 8080))
plugins.init()

from . import storages
storages.init()

from . import photos

def run():
	bottle.run(app=app.app, host=config.Config.Host, port=config.Config.Port, debug=True, server='gevent')
