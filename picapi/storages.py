from . import config
from .app import app

import os
from os import listdir
from os.path import isfile, isdir, join

import PIL
from PIL import Image, ImageOps

class LocalStorage():
	"""
		Store the photo in the local directory data/photos/uploads
	"""
	
	def saveAttachment(self, id, filename, options=None):
		filename = str(id)+'_'+filename

		if 'save' in options:
			options['save'](config.Path.Attachments, filename)
		else:
			return False

		return True
	def urlAttachment(self, id, filename):
		filename = str(id)+'_'+filename
		
		return config.Config.BaseUrl+'/static_attachement/'+filename

	def save(self, id, secret, o_secret, ext, options=None):
		o_filename = str(id) + '_' + secret + '_' + o_secret + ext
		if 'save' in options:
			options['save'](config.Path.Uploads, o_filename)
		else:
			return False

		basename = str(id) + '_' + secret
		im = Image.open(join(config.Path.Uploads, o_filename))
		if max(im.size) > 2048:
			im.thumbnail([2048,2048], Image.ANTIALIAS)
			im.save(join(config.Path.CachePhotos, basename+'_k'+ext), "JPEG")

		thumb = ImageOps.fit(im, [75,75], Image.ANTIALIAS)
		thumb.save(join(config.Path.CachePhotos, str(id) + '_' + secret + '_s' + ext), "JPEG")
		thumb = ImageOps.fit(im, [150,150], Image.ANTIALIAS)
		thumb.save(join(config.Path.CachePhotos, str(id) + '_' + secret + '_q' + ext), "JPEG")
		

		im2 = im.copy()
		im2.thumbnail([1600,1600], Image.ANTIALIAS)
		im2.save(join(config.Path.CachePhotos, basename+'_h'+ext), "JPEG")

		im = im.copy()
		im.thumbnail([1024,1024], Image.ANTIALIAS)
		im.save(join(config.Path.CachePhotos, basename+'_b'+ext), "JPEG")

		im2 = im.copy()
		im2.thumbnail([800,800], Image.ANTIALIAS)
		im2.save(join(config.Path.CachePhotos, basename+'_c'+ext), "JPEG")

		im2 = im.copy()
		im2.thumbnail([640,640], Image.ANTIALIAS)
		im2.save(join(config.Path.CachePhotos, basename+'_z'+ext), "JPEG")

		im2 = im.copy()
		im2.thumbnail([500,500], Image.ANTIALIAS)
		im2.save(join(config.Path.CachePhotos, basename+ext), "JPEG")

		im2 = im.copy()
		im2.thumbnail([320,320], Image.ANTIALIAS)
		im2.save(join(config.Path.CachePhotos, basename+'_n'+ext), "JPEG")

		im2 = im.copy()
		im2.thumbnail([240,240], Image.ANTIALIAS)
		im2.save(join(config.Path.CachePhotos, basename+'_m'+ext), "JPEG")

		return True

	def delete(self, id, secret, o_secret, ext):
		filename = str(id) + '_' + secret + '_' + o_secret + ext
		filename = join(config.Path.Uploads, filename)
		os.remove(filename)
		return True

	def url_info(self, id, secret, o_secret, ext):
		info = {
			'base'     : config.Config.BaseUrl+'/static/'+str(id) + '_' + secret,
			'extension': ext
		}
		if o_secret:
			info['original'] = config.Config.BaseUrl+'/o_static/'+str(id) + '_' + secret+o_secret+ext
		return info


stores = {}


def init():
	stores['local'] = LocalStorage()
