'use strict';

var execFile = require('child_process').execFile;
var exec = require('child_process').exec;
var path = require('path');
var async = require('async');
var CronJob = require('cron').CronJob;

var meta = module.parent.require('./meta');
var winston = module.parent.require('winston');

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

	router.get('/admin/plugins/tarsnap', hostMiddleware.admin.buildHeader, controllers.renderAdminPage);
	router.get('/api/admin/plugins/tarsnap', controllers.renderAdminPage);
	router.get('/api/admin/plugins/tarsnap/list', controllers.listArchives);
	router.post('/api/admin/plugins/tarsnap/run', controllers.runArchive);

	async.series([
		async.apply(plugin.refreshSettings),
		async.apply(plugin.startJob),
	], callback);
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

plugin.startJob = function (callback) {
	if (plugin.settings.schedule) {
		winston.verbose('[plugin/tarsnap] Registering scheduled job.');

		switch (plugin.settings.schedule) {
		case 'daily':
			new CronJob('0 0 * * *', plugin.run, null, true);
			break;
		case 'weekly':
			new CronJob('0 0 * * 0', plugin.run, null, true);
			break;
		default:
			winston.warn('[plugin/tarsnap] Scheduling option not recognised: `' + plugin.settings.schedule + '`. Scheduling disabled.');
			break;
		}

		process.nextTick(callback);
	} else {
		setImmediate(callback);
	}
};

plugin.list = function (callback) {
	var args = buildArgs(['--list-archives']);

	execFile(plugin.settings.executable, args, callback);
};

plugin.run = function (callback) {
	async.waterfall([
		function (next) {
			// Execute pre-run script, if present
			if (plugin.settings.preRun) {
				winston.verbose('[plugin/tarsnap] Executing pre-run script.');
				exec(plugin.settings.preRun, function (err) {
					next(err);	// specifically only returning err here.
				});
			} else {
				setImmediate(next);
			}
		},
		function (next) {
			exec('echo ' + plugin.settings.archiveFormat, next);
		},
		function (stdout, next) {
			var archiveName = stdout.trim();
			var args = buildArgs(['-cf', archiveName]);

			// Append files to be archived, to arguments
			plugin.settings.files.forEach(function (file) {
				args.push('-C', path.dirname(file), path.basename(file));
			});

			winston.verbose('[plugin/tarsnap] Executing backup.');
			execFile(plugin.settings.executable, args, next);
		},
		function (stdout, stderr, next) {
			winston.verbose('[plugin/tarsnap] Backup complete.');
			setImmediate(next, null, stdout, stderr);
		},
	], callback);
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
