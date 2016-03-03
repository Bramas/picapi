import os
from os.path import isfile, isdir, join



class Config:
	Port = 5000
	Host = 'localhost'
	BaseUrl = 'http://localhost:5000'
	AllowedExtensions = set(['.png', '.jpg', '.jpeg'])

class Path:
	Uploads = join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'photos', 'uploads')
	Attachments = join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'attachments')
	Data = join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data')
	Plugins = join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'plugins')
	Root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
	CachePhotos = join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'cache', 'photos')

def init(host='localhost', port=5000):
	Config.Port = port
	Config.Host = host
	if os.environ.get('BASE_URL'):
		Config.BaseUrl = os.environ.get('BASE_URL')
	else:
		Config.BaseUrl = '//'+host+':'+str(port)