//var exports = module.exports = {};

var auth = require('./cbotconfig.json');
const fs = require('fs');
var Twitter = require('twitter');
var request = require('request');
var client = new Twitter({
  consumer_key: auth.twitterkey,
  consumer_secret: auth.twittersecret,
  bearer_token: auth.twitterbtoken
});
var whconfig = require('./webhookconfig.json');
var util = require('util');

var seenids = {};

whconfig.twitters.forEach((user) => {
	seenids[user.screen_name] = [undefined, ""];
});

var kcprofileimg = "";
const tweetlogfile = './tweetlog.txt';
const profilelogfile = './profilelog.txt';
function logstr(file, init, user, msg) {
	var d = new Date();
	fs.appendFile(file, d.toUTCString() + "\nCurrent strings: " +  util.inspect(seenids, {depth : 9}) + "\n" + (init ? "init" : "new profile") + " : user : " + user + " , msg : " + msg + "\n", () => {});
}

/**
 * Stream statuses filtered by keyword
 * number of tweets per second depends on topic popularity
 **/
function getStatus(first) {
	whconfig.twitters.forEach(function(user){
		// console.log(user);
		if (first) {
			client.get('users/show', {screen_name : user.screen_name}, function(error, tweets, response) {
				// console.log(`${Date.now()}> ${response.statusCode}`);
				if (response.statusCode == 200) {
					kcprofileimg = JSON.parse(response.body).profile_image_url_https;
					seenids[user.screen_name].push(kcprofileimg);
					logstr(profilelogfile, true, user.screen_name, kcprofileimg);
				}
			});
		} else {
			client.get('users/show', {screen_name : user.screen_name}, function(error, tweets, response) {
				if (response.statusCode == 200) {
					var info = JSON.parse(response.body);
					// console.log(`${Date.now()}> ${response.statusCode} : ${info.profile_image_url_https}`);
					if (! seenids[user.screen_name].includes(info.profile_image_url_https)) {
						//fs.appendFile('./twitter.txt', util.inspect(info, {depth : 9}) + "\n", () => {});
						kcprofileimg = info.profile_image_url_https;
						seenids[user.screen_name].push(kcprofileimg);
						logstr(profilelogfile, false, user.screen_name, `${kcprofileimg}`);
						var lrg = kcprofileimg.replace("_normal", "");
						// console.log(kcprofileimg);
						user.webhooks.forEach(function(url){
							request.post({url:url,
								form: {
									content:`New KC profile image detected! ${lrg}`
								}},
								function(err, rsp, body){}
							);
						});
						const { fork } = require('child_process');
						fork('./whdiscord.js', [lrg]);
					}
				}
			});
		}
	});
}

function newTweet(tweetobj, user) {}

getStatus(1);

setInterval(getStatus, 1500 * 1000 * (whconfig.twitters.length + 2) / (15 * 60));

// client.stream('site', {follow: '448311788'}, function(stream) {
//   stream.on('data', function(event) {
//	 console.log(event && event.text);
//   });
//
//   stream.on('error', function(error) {
//	 throw error;
//   });
// });
