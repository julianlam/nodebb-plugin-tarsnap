'use strict';

/* globals config, define, $, app, socket, bootbox */

define('admin/plugins/tarsnap', ['settings', 'benchpress'], function (Settings, Benchpress) {
	var ACP = {
		_cache: {},
	};

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

		$('button[data-action]').on('click', function (e) {
			e.preventDefault();

			var action = this.getAttribute('data-action');

			switch (action) {
			case 'list':
				app.alertSuccess('Sending command...');
				$.get(config.relative_path + '/api/admin/plugins/tarsnap/archive')
					.done(ACP.handleResponse)
					.fail(ACP.handleError);
				break;
			case 'test':
				$.get(config.relative_path + '/api/admin/plugins/tarsnap/config')
					.done(ACP.handleResponse)
					.fail(ACP.handleError);
				break;
			case 'run':
				app.alertSuccess('Sending command...');
				$.post(config.relative_path + '/api/admin/plugins/tarsnap/archive')
					.done(ACP.handleResponse)
					.fail(ACP.handleError);
				break;
			case 'delete':
				ACP.openDeleteModal();
				break;
			}
		});
	};

	ACP.handleError = function (err) {
		bootbox.alert({
			title: 'Tarsnap sent back an error',
			message: '<pre>' + err.responseJSON.error + '</pre>',
			size: 'large',
		});
	};

	ACP.handleResponse = function (payload) {
		if (payload.command === 'list') {
			// Save a copy locally for use in delete modal
			ACP._cache.archives = payload.response.split(/\r?\n/);
		}

		bootbox.alert({
			title: 'Tarsnap sent back this response',
			message: '<pre>' + payload.response + '</pre>',
			size: 'large',
		});
	};

	ACP.openDeleteModal = function () {
		Benchpress.parse('admin/plugins/tarsnap/deleteModal', {
			archives: ACP._cache.archives || [],
		}, function (html) {
			bootbox.dialog({
				title: 'Delete Archives',
				message: html,
				size: 'large',
				buttons: {
					cancel: {
						label: '[[modules:bootbox.cancel]]',
						className: 'btn-link',
					},
					save: {
						label: '[[modules:bootbox.confirm]]',
						className: 'btn-primary',
						callback: ACP.commitDelete,
					},
				},
			});
		});
	};

	ACP.commitDelete = function (evt) {
		app.alertSuccess('Sending command...');
		$(evt.delegateTarget).modal('hide');

		var archives = $('#tarsnap-delete-modal-archive-list').val();

		$.post({
			url: config.relative_path + '/api/admin/plugins/tarsnap/archive/delete',
			data: {
				archives: archives,
			},
		}).done(ACP.handleResponse).fail(ACP.handleError);

		return false;
	};

	return ACP;
});
