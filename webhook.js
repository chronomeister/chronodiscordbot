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

var lastseenid = {};
whconfig.twitters.forEach(function(user){
	user.lastseenid = "";
});
var kcprofileimg = "";
const tweetlogfile = './tweetlog.txt';
const profilelogfile = './profilelog.txt';
function logstr(file, init, user, msg) {
	var d = new Date();
	fs.appendFile(file, d.toUTCString() + " : " + (init ? "init" : "new profile") + " : user : " + user + " , msg : " + msg + "\n", () => {});
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
				if (user.screen_name == "KanColle_STAFF") {
					kcprofileimg = JSON.parse(response.body).profile_image_url_https;
					logstr(profilelogfile, true, user.screen_name, kcprofileimg);
				}
			});
		} else {
			if (user.screen_name == "KanColle_STAFF") {
				client.get('users/show', {screen_name : user.screen_name}, function(error, tweets, response) {
					if (response.body) {
						var info = JSON.parse(response.body);
						console.dir(info.profile_image_url_https);
						const fs = require('fs'); var util = require('util'); fs.appendFile('./dump.txt', util.inspect(info, {depth : 9}) + "\n", () => {});
						if (info.profile_image_url_https && kcprofileimg != info.profile_image_url_https) {
							kcprofileimg = info.profile_image_url_https;
							logstr(profilelogfile, false, user.screen_name, kcprofileimg);
							var lrg = kcprofileimg.replace("_normal", "");
							console.log(kcprofileimg);
							user.webhooks.forEach(function(url){
								request.post({url:url,
									form: {
										content:`New KC profile image detected! ${lrg}`
									}},
									function(err, rsp, body){}
								);
							});
							whconfig.selfposts.forEach(function(post){
								me.guilds.get(post.guild).channels.get(post.channel).send(lrg);
							})
						}
					}
				});
			}
		}
	});
}

function newTweet(tweetobj, user) {}

var Discord = require("discord.js");
var me = new Discord.Client();
me.login(whconfig.selftoken);

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
