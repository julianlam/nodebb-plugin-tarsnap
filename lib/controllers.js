'use strict';

var nconf = require.main.require('nconf');

var Controllers = {};

Controllers.renderAdminPage = function (req, res, next) {
	res.render('admin/plugins/tarsnap', {
		uploadPath: nconf.get('upload_path'),
	});
};

Controllers.listArchives = function (req, res, next) {
	var main = module.parent.exports;

	main.list(function (err, archives) {
		if (err) {
			return res.status(500).json({
				error: err.message,
			});
		}

		res.json({
			response: archives,
		});
	});
};

Controllers.runArchive = function (req, res, next) {
	var main = module.parent.exports;

	main.run(function (err, stdout, stderr) {
		if (err) {
			return res.status(500).json({
				error: err.message,
			});
		}

		res.json({
			response: stderr,
		});
	});
};

module.exports = Controllers;
