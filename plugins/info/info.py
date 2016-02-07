from picapi.plugins import add_hook
from picapi.app import app, success

import bottle



def validate_echo(value, request, **kwargs):
	if request.route.rule == '/echo/<message>':
		return True, True
	if bottle.local.user:
		print(bottle.local.user)

	bottle.response.set_header('Access-Control-Allow-Origin', '*')
	#set the website public
	return True, True

add_hook('filter_request_validation', validate_echo)



@app.route('/echo/<message>')
def echo(message):
	return success({'message':message})


@app.route('/info')
def echo():
	return success({"config":{"version":"030003","thumbQuality":"90","checkForUpdates":"1","sortingPhotos":"ORDER BY takestamp DESC","sortingAlbums":"ORDER BY id DESC","medium":"1","imagick":"1","dropboxKey":"","skipDuplicates":"0","plugins":"","location":"/home/bramas/Lychee/","login":true},"status":2})