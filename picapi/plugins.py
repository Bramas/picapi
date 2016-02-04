
import sys, os
from os import listdir
from os.path import isfile, isdir, join

import bottle
from bottle import request, response

import log, config
from app import app, success, error

hooks = {}

debug_hook_calls = False

def add_hook(name, func):
	log.info('plugins::add_hook: '+name+' => '+str(func))
	if not name in hooks:
		hooks[name] = []
	hooks[name].append(func)

def trigger_event(name, *args,**kwargs):
	if debug_hook_calls: log.info('plugins::trigger_event: '+str(name))
	if name in hooks:
		for func in hooks[name]:
			func(*args, **kwargs)

def trigger_filter(name, value, *args,**kwargs):
	if debug_hook_calls: log.info('plugins::trigger_filter: '+str(name)+ ' ('+str(value)+')')
	if name in hooks:
		for func in hooks[name]:

			nextValue = func(value, *args, **kwargs)

			# if it is a tuple, and the second value is true, then we don't evaluate the other rules 
			if isinstance(nextValue, tuple) and len(nextValue) == 2 and nextValue[1]:
				return nextValue[0]

			# if the value is None the value is not changed
			if nextValue != None:
				value = nextValue 

	return value

def run_hook(name, *args,**kwargs):
	if name[:3] == 'on_':
		return trigger_event(name, *args,**kwargs)
	return trigger_filter(name, *args,**kwargs)

def pluginWrapper(callback):
	def wrapper(*args, **kwargs):
		bottle.response.set_header('content-type', 'application/json; charset=utf8')
		yield ''
		run_hook('on_before_request_validation', request=request)
		if not run_hook('filter_request_validation', False, request=request):
			run_hook('on_request_validation_failed', request=request)
			yield error('Unauthorized', code=401)
			return
		run_hook('on_request_validation_succeed', request=request)

		run_hook('on_request', request=request)

		#call the original callback
		body = callback(*args, **kwargs)

		if isinstance(body, bool):
			if body:
				yield success()
			else:
				yield error()
			return
		
		yield body
		run_hook('on_body_sent', body=body)

	return wrapper

def init():


	app.install(pluginWrapper)

	sys.path.append(config.Path.Plugins)
	for f in listdir(config.Path.Plugins):
		if isdir(join(config.Path.Plugins, f)):
			plugin = join(config.Path.Plugins, f, f)
			if isfile(plugin+'.py'):
				plugin = f + '.' + f
				print(plugin)
				__import__(plugin)