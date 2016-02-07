from . import config

import os
from os import listdir
from os.path import isfile, isdir, join

import PIL
from PIL import Image

class LocalStorage():
	"""
		Store the photo in the local directory data/photos/uploads
	"""
	
	def save(self, id, secret, o_secret, ext, options=None):
		o_filename = str(id) + '_' + secret + '_' + o_secret + ext
		if 'save' in options:
			options['save'](config.Path.Uploads, o_filename)
		else:
			return False

		filename = str(id) + '_' + secret + ext
		im = Image.open(join(config.Path.Uploads, o_filename))
		im.thumbnail([100,100], Image.ANTIALIAS)
		im.save(join(config.Path.CachePhotos, filename), "JPEG")
		return True

	def delete(self, id, secret, o_secret, ext):
		filename = str(id) + '_' + secret + '_' + o_secret + ext
		filename = join(config.Path.Uploads, filename)
		os.remove(filename)
		return True

	def url_info(self, id, secret, o_secret, ext):
		info = {
			'base'     : 'http://localhost:8080/static/'+str(id) + '_' + secret,
			'extension': ext
		}
		if o_secret:
			info['original'] = 'http://localhost:8080/o_static/'+str(id) + '_' + secret+o_secret+ext
		return info


stores = {}


def init():
	stores['local'] = LocalStorage()
