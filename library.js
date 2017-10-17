'use strict';

var execFile = require('child_process').execFile;
var exec = require('child_process').exec;
var path = require('path');
var async = require('async');

var meta = module.parent.require('./meta');

var controllers = require('./lib/controllers');

var plugin = {
	settings: {},
	_defaults: {
		executable: '/usr/bin/tarsnap',
		archiveFormat: '$(uname -n)-$(date +%Y-%m-%d_%H-%M-%S)',
	},
};

plugin.init = function (params, callback) {
	var router = params.router;
	var hostMiddleware = params.middleware;
	var hostControllers = params.controllers;

	router.get('/admin/plugins/tarsnap', hostMiddleware.admin.buildHeader, controllers.renderAdminPage);
	router.get('/api/admin/plugins/tarsnap', controllers.renderAdminPage);
	router.get('/api/admin/plugins/tarsnap/list', controllers.listArchives);
	router.post('/api/admin/plugins/tarsnap/run', controllers.runArchive);

	plugin.refreshSettings(callback);
};

plugin.addAdminNavigation = function (header, callback) {
	header.plugins.push({
		route: '/plugins/tarsnap',
		icon: 'fa-cloud',
		name: 'Tarsnap',
	});

	callback(null, header);
};

plugin.refreshSettings = function (callback) {
	meta.settings.get('tarsnap', function (err, settings) {
		if (err) {
			return callback(err);
		}

		// Remove empty settings
		for (var prop in settings) {
			if (settings.hasOwnProperty(prop) && !settings[prop]) {
				delete settings[prop];
			}
		}

		// Split out files list to array
		if (settings.files) {
			settings.files = settings.files.split(/\r?\n/).filter(function (file) {
				file = file.trim();
				return !!file;
			});
		} else {
			settings.files = [];
		}

		// Save to plugin-wide settings object
		Object.assign(plugin.settings, plugin._defaults, settings);
		callback();
	});
};

plugin.list = function (callback) {
	var args = buildArgs(['--list-archives']);

	execFile(plugin.settings.executable, args, callback);
};

plugin.run = function (callback) {
	async.waterfall([
		function (next) {
			// Execute pre-run script, if present
			exec(plugin.settings.preRun, function (err) {
				next(err);	// specifically only returning err here.
			});
		},
		function (next) {
			exec('echo ' + plugin.settings.archiveFormat, next);
		},
		function (stdout) {
			var archiveName = stdout.trim();
			var args = buildArgs(['-cf', archiveName]);

			// Append files to be archived, to arguments
			plugin.settings.files.forEach(function (file) {
				args.push('-C', path.dirname(file), path.basename(file));
			});

			execFile(plugin.settings.executable, args, callback);
		},
	]);
};

plugin.test = function () {};

function buildArgs(args) {
	if (plugin.settings.keyfile) {
		args.push('--keyfile', plugin.settings.keyfile);
	}

	if (plugin.settings.cachedir) {
		args.push('--cachedir', plugin.settings.cachedir);
	}

	return args;
}

module.exports = plugin;
