# Tarsnap Plugin for NodeBB

This is a Tarsnap plugin for NodeBB. Keep in mind it is merely an interface, and **you still have to figure
out how to install Tarsnap on your server** before this plugin is of any use.

## What's Tarsnap?

Tarsnap is a secure, efficient online backup service. It was made by Colin Percival (🇨🇦!)

## How do I set it up?

You'll want to check out [the "Getting Started" guide](https://www.tarsnap.com/gettingstarted.html), set
up your account, and install Tarsnap to the server hosting your NodeBB files (or honestly, whatever
else you want to archive).

Then, install the plugin, `./nodebb build`, and configure the plugin in the plugin page.

## Remember these rules of the road...

* Never compress your data prior to archiving it in Tarsnap
  * Tarsnap automatically [deduplicates and compresses](http://www.tarsnap.com/deduplication.html) your data when you send it up, meaning fewer bytes get transferred, and fewer bytes get stored. Compressing the data yourself can throw a wrench in this process, causing the deduplication to incorrectly conclude that some blocks have changed (as they look different when compressed) even though they are/have not.
* Frequently check your backups for validity!
  * It is not enough simply to have a backup plan in place. For unforseen reasons backups may stop working, or they may have been incorrectly configured from the start. Some horror stories include perfectly _working_ backups, but corrupted files that could not be used during recovery. This plugin lets you "list" your archives to see whether they are still being made/stored regularly, but you should also periodically download them to check them for validity.
* Always ensure that the email you signed up to Tarsnap can receive messages from Tarsnap!
  * The service requires a deposit and running out of money will cause your data to be deleted! Tarsnap emails you when you come close to running out of money, and so adding <cperciva@tarsnap.com> to your mail whitelist is probably a good idea.