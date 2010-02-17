/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is the tr.im Jetpack Feature.
 *
 * The Initial Developer of the Original Code is
 * Paul O’Shannessy <paul@oshannessy.com>
 * Dion Almaer <http://almaer.com/>
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 * sabret00the <sabret00the@yahoo.co.uk>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

jetpack.future.import("menu");
jetpack.future.import("clipboard");

var manifest = {
	settings: [ 
  	{ name: "trimUsername", type: "text", label: "tr.im Username" },
    { name: "trimPassword", type: "password", label: "tr.im Password" }
  ]
};

jetpack.future.import("storage.settings");

function trimUrl(urlToTrim, mods) {
  //var url = "http://tr.im/api/trim_url.json";
  var url = "http://api.tr.im/v1/trim_url.json";
  var params = Array();
  params.url = urlToTrim;
  if (!params.url)
    params.url = jetpack.tabs.focused.url;
  var TrImPrefs = jetpack.storage.settings;
  if (mods.trimUsername && mods.trimPassword) {
    params.username = mods.trimUsername;
    params.password = mods.trimPassword;
  } else if (TrImPrefs) {
    params.username = TrImPrefs.trimUsername;
    params.password = TrImPrefs.trimPassword;
  }
  params.api_key = '7Ctm8v3s5Fr4ePaJ8xzsrJSQGwjC68SFkeAHDrydiuEKjccY';
  jQuery.get (url, params, function (reply) {
    if (reply.status.code >= 400)
	    jetpack.notifications.show({
	      title: "tr.im",
	      body: reply.status.message,
	      icon: "http://tr.im/favicon.ico"
	    });
    else {
      jetpack.clipboard.set(reply.url);
	    jetpack.notifications.show({
	      title: "tr.im",
	      body: "Copied the trimmed URL (" + reply.url + ") to your clipboard.",
	      icon: "http://tr.im/favicon.ico"
	    });
    }
  }, 'json');
 }

jetpack.menu.context.page.add({
	label: "tr.im This Page",
	icon: "http://tr.im/favicon.ico",
	command: function(widget){
    $(widget).click(function(){
      trimUrl(jetpack.tabs.focused.url, jetpack.storage.settings);
    });
  }
});

jetpack.statusBar.append({
  html: "<span id='trim'><img src='http://tr.im/favicon.ico' class='trimimage' />&nbsp;tr.im</span>",
  width: 50,
  onReady: function(widget){
    $(widget).click(function(){
      trimUrl(jetpack.tabs.focused.url, jetpack.storage.settings);
    });
  }
});