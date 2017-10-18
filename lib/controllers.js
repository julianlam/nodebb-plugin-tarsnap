'use strict';

var nconf = require.main.require('nconf');

var Controllers = {};

Controllers.renderAdminPage = function (req, res, next) {
	res.render('admin/plugins/tarsnap', {
		uploadPath: nconf.get('upload_path'),
	});
};

Controllers.testConfig = function (req, res, next) {
	var main = module.parent.exports;
	main.testConfig(function (err) {
		if (err) {
			return res.status(500).json({
				command: 'test',
				error: err.message,
			});
		}

		res.json({
			command: 'test',
			response: 'Tarsnap configuration OK',
		});
	});
};

Controllers.listArchives = function (req, res, next) {
	var main = module.parent.exports;

	main.list(function (err, archives) {
		if (err) {
			return res.status(500).json({
				command: 'list',
				error: err.message,
			});
		}

		res.json({
			command: 'list',
			response: archives,
		});
	});
};

Controllers.runArchive = function (req, res, next) {
	var main = module.parent.exports;

	main.run(function (err, stdout, stderr) {
		if (err) {
			return res.status(500).json({
				command: 'run',
				error: err.message,
			});
		}

		res.json({
			command: 'run',
			response: stderr,
		});
	});
};

Controllers.deleteArchives = function (req, res, next) {
	if (!req.body.archives || !Array.isArray(req.body.archives) || !req.body.archives.length) {
		return res.status(400).json({
			command: 'delete',
			error: '[[error:invalid-data]]',
		});
	}

	var main = module.parent.exports;

	main.delete(req.body.archives, function (err, stdout, stderr) {
		if (err) {
			return res.status(500).json({
				command: 'delete',
				error: err.message,
			});
		}

		res.json({
			command: 'delete',
			response: stderr,
		});
	});
};

module.exports = Controllers;
