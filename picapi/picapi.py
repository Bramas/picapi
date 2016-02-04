from gevent import monkey; monkey.patch_all()

import bottle

from . import app
app.init()

from . import plugins, config
plugins.init()

import storages
storages.init()

import endpoints # loads endpoints



from beaker.middleware import SessionMiddleware
session_opts = {
    'session.type': 'file',
    'session.cookie_expires': 300,
    'session.data_dir': config.Path.Root+'/cache/session',
    'session.auto': True
}
wrappedApp = SessionMiddleware(app.app, session_opts)
if __name__ == '__main__':
	bottle.run(app=wrappedApp, host='localhost', port=8080, debug=True, server='gevent')
