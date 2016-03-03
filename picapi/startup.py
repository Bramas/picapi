import os

from . import config

for p in [config.Path.Uploads, config.Path.Attachments, config.Path.CachePhotos]:
	if not os.path.exists(p):
		os.makedirs(p)