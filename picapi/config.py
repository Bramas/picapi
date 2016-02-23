import os
from os.path import isfile, isdir, join

class Config:
	AllowedExtensions = set(['.png', '.jpg', '.jpeg'])

class Path:
	Uploads = join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'photos', 'uploads')
	Attachments = join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'attachments')
	Data = join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data')
	Plugins = join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'plugins')
	Root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
	CachePhotos = join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'cache', 'photos')
