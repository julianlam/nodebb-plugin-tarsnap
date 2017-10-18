<form role="form" class="tarsnap-settings">
	<div class="row">
		<div class="col-sm-2 col-xs-12 settings-header">Commands</div>
		<div class="col-sm-10 col-xs-12">
			<p class="lead">
				This plugin requires that <a href="https://www.tarsnap.com">Tarsnap</a> is properly set-up.
				Consult the <a href="https://www.tarsnap.com/gettingstarted.html">"Getting Started"</a> guide
				for more information.
			</p>
			<button class="btn btn-primary" data-action="run">Run</button>
			<button class="btn btn-default" data-action="test">Test Configuration</button>
			<button class="btn btn-default" data-action="list">List Archives</button>
			<button class="btn btn-danger" data-action="delete">Delete Archives <i class="fa fa-window-restore"></i></i></button>
		</div>
	</div>
	
	<hr />

	<div class="row">
		<div class="col-sm-2 col-xs-12 settings-header">Scheduling Options</div>
		<div class="col-sm-10 col-xs-12">
			<div class="form-group">
				<label for="schedule">Run Tarsnap backup...</label>
				<select id="schedule" name="schedule" title="Scheduled Backup" class="form-control">
					<option>Manually (no scheduling)</option>
					<option value="daily">Daily</option>
					<option value="weekly">Weekly</option>
				</select>
			</div>
		</div>
	</div>

	<div class="row">
		<div class="col-sm-2 col-xs-12 settings-header">Required Settings</div>
		<div class="col-sm-10 col-xs-12">
			<div class="form-group">
				<label for="files">List of files and/or directories to include</label>
				<textarea id="files" name="files" title="File list" class="form-control" placeholder="$HOME/database-export.sh"></textarea>
				<p class="help-block">
					Define a list of files to be included in the backup, <strong>separated by newlines</strong>. The plugin will place all of the
					defined files and directories into the root of the archive (in <code>tar</code> parlance, <code>-C</code>
					will be used before every defined file/directory, pointing to the immediate parent).
					<br><br>
					The NodeBB uploads folder is located at <code>{uploadPath}</code>.
				</p>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-sm-2 col-xs-12 settings-header">Optional Settings</div>
		<div class="col-sm-10 col-xs-12">
			<div class="form-group">
				<label for="executable">Path to Tarsnap executable</label>
				<input type="text" id="executable" name="executable" title="Path to Tarsnap executable" class="form-control" placeholder="/usr/bin/tarsnap">
				<p class="help-block">
					Default: <code>/usr/bin/tarsnap</code>
				</p>
			</div>
			<div class="form-group">
				<label for="keyfile">Path to Tarsnap key file</label>
				<input type="text" id="keyfile" name="keyfile" title="Path to Tarsnap key file" class="form-control" placeholder="$HOME/tarsnap.key">
				<p class="help-block">
					Remember to always ensure that this key has limited access by restricting permissions to the running user.
					Alternatively, consider a <a href="https://www.tarsnap.com/tips.html#write-only-keys">write-only key</a>.
					<br><br>
					If left blank, the default keyfile path defined in the tarsnap config will be used.
				</p>
			</div>
			<div class="form-group">
				<label for="cachedir">Path to Tarsnap cache directory</label>
				<input type="text" id="cachedir" name="cachedir" title="Path to Tarsnap cache directory" class="form-control" placeholder="$HOME/.tarsnap-cache">
				<p class="help-block">
					If left blank, the default cache directory defined in the tarsnap config will be used.
				</p>
			</div>
			<div class="form-group">
				<label for="archiveFormat">Archive Format</label>
				<input type="text" id="archiveFormat" name="archiveFormat" title="Archive Format" class="form-control" placeholder="$(uname -n)-$(date +%Y-%m-%d_%H-%M-%S)">
				<p class="help-block">
					If left blank, the format <code>$(uname -n)-$(date +%Y-%m-%d_%H-%M-%S)</code> will be used.
				</p>
			</div>
			<div class="form-group">
				<label for="preRun">Pre-run Script</label>
				<input type="text" id="preRun" name="preRun" title="Pre-run Script" class="form-control" placeholder="$HOME/database-export.sh">
				<p class="help-block">
					If you need to run specific tasks via a script, define it here. This script will be run before
					every manual and scheduled tarsnap backup.
				</p>
			</div>
		</div>
	</div>
</form>

<button id="save" class="floating-button mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
	<i class="material-icons">save</i>
</button>