import bottle
import os, json, time
from os.path import isfile, isdir, join

from . import config, database
from .plugins import add_hook
from .app import app, success, error

import hmac, base64

def user():
	s = bottle.request.environ.get('beaker.session')
	return s.get('user', {'role':'guest'})



def validate_request(is_valid, request, **kwargs):
	#define public url for the authentification
	if request.route.rule in ('/authenticate', '/oauth2callback', '/auth_uri'):
		return True
	
	#For the other urls, check if the user is connected
	if bottle.local.user and bottle.local.user['role'] == 'admin':
		return True

add_hook('filter_request_validation', validate_request)

def authenticate_token(request, **kwargs):
	bottle.local.user = None
	auth = request.get_header('Authorization')
	if auth:
		_, token = auth.split()
		user = AuthServer().validate_token(token)
		if user:
			bottle.local.user = user

def delete_user(**kwargs):
	bottle.local.user = None


add_hook('on_before_request_validation', authenticate_token)
add_hook('on_body_sent', delete_user)


import httplib2
from oauth2client import client
from apiclient import discovery
import os

if os.environ.get('GOOGLE_OAUTH2_client_id'):
	from oauth2client.client import OAuth2WebServerFlow
	flow = OAuth2WebServerFlow(client_id= os.environ.get('GOOGLE_OAUTH2_client_id'),
                           client_secret= os.environ.get('GOOGLE_OAUTH2_client_secret'),
                           scope='https://www.googleapis.com/auth/userinfo.email',
                           redirect_uri='http://localhost:8080/oauth2callback')
else:
	flow = client.flow_from_clientsecrets(
		join(config.Path.Data, 'client_secrets.json'),
		scope='https://www.googleapis.com/auth/userinfo.email',
		redirect_uri='http://localhost:8080/oauth2callback')

class FakeProvider:

	def getUserFromCode(self, code):
		db = database.connect()
		user = dict(db.execute('SELECT * FROM users WHERE role = "admin" LIMIT 1').fetchone())
		db.close()
		return user


class GoogleProvider:
	def getUserFromCode(self, code):
		print('try to validate code '+code)
		try:
			credentials = flow.step2_exchange(code)

			http_auth = credentials.authorize(httplib2.Http())
			service = discovery.build('oauth2', 'v2', http=http_auth)

			userinfo = service.userinfo().get().execute()
			email = userinfo['email']
			db = database.connect()
			user = dict(db.execute('SELECT * FROM users WHERE email = ?', (email)).fetchone())
			db.close()
			return user
		except Exception as inst:
			print(inst)
			return False

secret = b'123456'

class AuthServer():
	def generate_token(self,user, duration=3600):
		h = hmac.new(secret,digestmod='sha256')
		msg = {'user':user, 'expire': int(time.time()) + duration}
		msgString = '1.' + base64.b64encode(json.dumps(msg).encode('utf8')).decode('latin1')
		h.update(msgString.encode('latin1'))
		return msgString+'.'+base64.b64encode(h.digest()).decode('latin1')

	def validate_token(self, token):
		version, msg, key = token.split('.')
		if version == '1':
			h = hmac.new(secret, digestmod='sha256')
			h.update((version+'.'+msg).encode('latin1'))
			serverKey = base64.b64encode(h.digest()).decode('latin1')
			if serverKey != key:
				return False

			msg = base64.b64decode(msg.encode('latin1')).decode('utf8')
			msgObject = json.loads(msg)
			if msgObject['expire'] < int(time.time()):
				return False
			return msgObject['user']
		print('unknown token version', version)
		return False


@app.route('/authenticate', method='GET')
def authenticate():
	for param in ('code', 'provider'):
		if not param in bottle.request.params:
			return error()

	if bottle.request.params['provider'] != 'google':
		return  {"error":"invalid_provider", "error_description":"Please provide a valid provider."}

	#user = GoogleProvider().getUserFromCode(bottle.request.params['code'])
	user = FakeProvider().getUserFromCode(bottle.request.params['code'])
	
	if not user:
		return error()
	
	token = AuthServer().generate_token(user)

	return success({'token' : token})


@app.route('/oauth2callback')
def oauth2callback():
	s = bottle.request.environ.get('beaker.session')
	s['user'] = {
		'email': GoogleProvider().getUserFromCode(bottle.request.params['code']),
		'role' : 'admin'
	}
	return bottle.redirect('/me')

@app.route('/me')
def me():
	s = bottle.request.environ.get('beaker.session')
	return success(s.get('user', {}))

@app.route('/auth_uri')
def auth_uri():
	auth_uri = flow.step1_get_authorize_url()
	return success({'auth_uri': auth_uri})










"""

import oauthlib.oauth2
from oauthlib.oauth2 import LegacyApplicationServer
from oauthlib.oauth2 import RequestValidator

class MyRequestValidator(RequestValidator):
	def __init__(self):
		self.tokens = {}
	def client_authentication_required(self, request, *args, **kwargs):
		return False
	def validate_client_id(self, client_id, request):
		return True
	def authenticate_client_id(cient_id, request, *args, **kwargs):
		return True

	def validate_user(self, username, password, client, request, *args, **kwargs):
		request.user = GoogleProvider().getUserFromCode(bottle.request.params['code'])
		if request.user == False:
			return False
		request.client =  oauthlib.oauth2.Client(request.client_id)
		return True


	def validate_grant_type(self, client_id, grant_type, client, request, *args, **kwargs):
		if grant_type == 'password':
			return True
		return False

	def get_default_scopes(self, client_id, request, *args, **kwargs):
		return ['private_albums', 'public_albums', 'upload']

	def validate_scopes(self, client_id, scopes, client, request, *args, **kwargs):
		return True


	def save_bearer_token(self, token, request, *args, **kwargs):
		self.tokens[token['access_token']] = token
		return 'redirect_uri'


AuthServer = LegacyApplicationServer(MyRequestValidator())
"""