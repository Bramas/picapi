
from picapi import storages, config

import  os
from os.path import isfile, isdir, join

import swiftclient
import json

f = open(join(config.Path.Data,'ovh_secrets.json'),'rt')

if not f:
	log.error('unable to find swift credentials')

swiftConfig = json.loads(f.read())

if not swiftConfig:
	log.error('unable to load swift credentials')

publicUrl = swiftConfig['public_url']
del swiftConfig['public_url']

connection = swiftclient.Connection(**swiftConfig)

for container in connection.get_account()[1]:
    print('Container: '+container['name'])


class OvhPublicCloudStorage():
	def url(self, filename, type):
		filename = type+'/'+filename
		return publicUrl+'/'+filename
		
	def save(self, file, filename, type, content_type=None):


		#if not os.path.exists(join(config.Path.Data, 'ovhStorage',type)):
		#	os.makedirs(join(config.Path.Data, 'ovhStorage',type))
		#f = open(join(config.Path.Data, 'ovhStorage', type, filename), 'wb')
		#f.write(file.read())
		#f.close()

		connection.put_object('PhotosStatic', type+'/'+filename, contents=file, content_type=content_type)

		return True
		
	def delete(self, filename, type):
		filepath = join(config.Path.Data, 'ovhStorage', type, filename)
		if isfile(filepath):
			os.remove(filepath)
		return True



storages.stores['ovhpublic'] = OvhPublicCloudStorage()
storages.defaultStore = 'ovhpublic'