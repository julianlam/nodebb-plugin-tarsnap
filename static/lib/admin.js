'use strict';

/* globals config, define, $, app, socket, bootbox */

define('admin/plugins/tarsnap', ['settings'], function (Settings) {
	var ACP = {};

	ACP.init = function () {
		Settings.load('tarsnap', $('.tarsnap-settings'));

		$('#save').on('click', function () {
			Settings.save('tarsnap', $('.tarsnap-settings'), function () {
				app.alert({
					type: 'success',
					alert_id: 'tarsnap-saved',
					title: 'Settings Saved',
					message: 'Please reload your NodeBB to apply these settings',
					clickfn: function () {
						socket.emit('admin.reload');
					},
				});
			});
		});

		function handleError(err) {
			bootbox.alert({
				title: 'Tarsnap sent back an error',
				message: '<pre>' + err.responseJSON.error + '</pre>',
				size: 'large',
			});
		}

		function handleResponse(payload) {
			bootbox.alert({
				title: 'Tarsnap sent back this response',
				message: '<pre>' + payload.response + '</pre>',
				size: 'large',
			});
		}

		$('button[data-action]').on('click', function (e) {
			e.preventDefault();

			var action = this.getAttribute('data-action');

			switch (action) {
			case 'list':
				app.alertSuccess('Sending command...');
				$.get(config.relative_path + '/api/admin/plugins/tarsnap/list')
					.done(handleResponse)
					.fail(handleError);
				break;
			case 'run':
				app.alertSuccess('Sending command...');
				$.post(config.relative_path + '/api/admin/plugins/tarsnap/run')
					.done(handleResponse)
					.fail(handleError);
				break;
			}
		});
	};

	return ACP;
});
