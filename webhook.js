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
whconfig.forEach(function(user){
	user.lastseenid = "";
});
var kcprofileimg = "";
/**
 * Stream statuses filtered by keyword
 * number of tweets per second depends on topic popularity
 **/
function getStatus(first) {
	whconfig.forEach(function(user){
		// console.log(user);
		if (first) {
			client.get('statuses/user_timeline', {screen_name : user.screen_name, tweet_mode : "extended"}, function(error, tweets, response) {
				var tweetobj = JSON.parse(response.body)[0];
				console.dir(JSON.parse(response.body)[0].lang);
				if (user.TL) {
					console.log(`${user.screen_name} needs TL`);
				} else {
					console.log(`${user.screen_name} none TL`);
				}

				user.lastseenid = JSON.parse(response.body)[0].id_str;
				// console.dir(user);
				if (user.screen_name == "KanColle_STAFF") {
					kcprofileimg = JSON.parse(response.body)[0].user.profile_image_url_https;
					//testing
				}
				newTweet(tweetobj,user);
			});
		} else {
			client.get('statuses/user_timeline', {screen_name : user.screen_name, since_id : user.lastseenid, tweet_mode : "extended"}, function(error, tweets, response) {
			// client.get('statuses/user_timeline', {screen_name : user.screen_name, count : 1}, function(error, tweets, response) {
				// fs.writeFile('./twitter.txt', response.body, function(){}); return;
				var tweets = JSON.parse(response.body);
				var ids = tweets.map(function(status){
					return status.id_str;
				});
				// console.log(user.screen_name + " : " + user.lastseenid);
				user.lastseenid = tweets[0] ? tweets[0].id_str : user.lastseenid;
				while (tweets.length > 0) {
					var newtweet = tweets.pop();
					newTweet(newtweet,user);
					// console.log(newtweetid);
					// request.post({url:'https://discordapp.com/api/webhooks/304453640138260481/smTg_XBiNvPHzaSQk0TUOvhAMYpxFxa5L3JOxOTlrxeU4A71SJfxTeyYv7_Y0W-F2DWA',
				}
			});
			if (user.screen_name == "KanColle_STAFF") {
				client.get('users/show', {screen_name : user.screen_name}, function(error, tweets, response) {
					var info = JSON.parse(response.body);
					if (kcprofileimg != info.profile_image_url_https) {
						kcprofileimg = info.profile_image_url_https;
						user.webhooks.forEach(function(url){
							var lrg = kcprofileimg.replace("normal", "400x400");
							request.post({url:url,
								form: {
									content:`New KC profile image detected! ${lrg}`
								}},
								function(err, rsp, body){}
							);
						});
					}
				});
			}
		}
	});
}

function newTweet(tweetobj, user) {
	var xmlparse = require('xml-js');
	var util = require("util");
	var newtweetid = tweetobj.id_str;
	user.webhooks.forEach(function(url){
		request.post({url:url,
			form: {
				content:`https://twitter.com/${user.screen_name}/status/${newtweetid}`,
				username: user.screen_name,
				avatar_url: tweetobj.user.profile_image_url_https
			}},
			function(err, rsp, body){

			}
		);
	});

	if (user.screen_name == "kancolle_1draw") {

		var namemap = require('./1HDnames.json');
		var match = (tweetobj.full_text.match(/お題は ([^\r\n]+) .なります/));
		if (!match) return;
		var names = match[1].trim().split(/ /)
		// console.dir(names);
		var enlist = [];
		names.forEach(function(name){
			if (namemap[name]) enlist.push(namemap[name]);
		});
		var tl = "";
		// console.log(enlist.length);
		switch (enlist.length){
			case 0:
			tl = "I can't identify any ships today. I blame chrono.";
			break;
			case 1:
			tl = "Looks like today's 1HD is " + enlist.join(", ") + " and two ships I can't identify";
			break;
			case 2:
			tl = "Looks like today's 1HD is " + enlist.join(", ") + " and one ship I can't identify";
			break;
			case 3:
			enlist[2] = "and " + enlist[2];
			tl = "Looks like today's 1HD is " + enlist.join(", ");
			break;
			default:
			tl = "Something is a bit off and I shouldn't even be saying this meesage. I blame chrono";
			break;
		}
		request.post({url:url,
			form: {
				payload_json : JSON.stringify({
					username: user.screen_name,
					avatar_url: tweetobj.user.profile_image_url_https,
					embeds : [
						{
							description : tl,
						}
					]
				})
			}
		},
		function(err, rsp, body){}
		);
	} else if (user.screen_name == "KanColle_STAFF") {
		request.get({
			url : 'https://api.microsofttranslator.com/V2/Http.svc/Translate',
			headers : {
				'Ocp-Apim-Subscription-Key': auth.msazurekey
			},
			qs : {
				'appid' : '',
				'text' : tweetobj.full_text,
				'from' : tweetobj.lang,
				'to' : 'en'
			},
			body : ''
		}, function (error, rsp, html) {
			var body = xmlparse.xml2js(rsp.body, {compact: true});
			var tl = body.string._text.replace(/ship (it|this)/ig, "KanColle");
			user.webhooks.forEach(function(url){
				request.post({url:url,
					form: {
						payload_json : JSON.stringify({
							username: user.screen_name,
							avatar_url: tweetobj.user.profile_image_url_https,
							embeds : [
								{
									description : tl,
								}
							]
						})
					}
				},
				function(err, rsp, body){}
				);
			});
		});
	}

}

getStatus(1);

// setTimeout(getStatus, 1000);
setInterval(getStatus, 1500 * 1000 * (whconfig.length + 2) / (15 * 60));

// client.stream('site', {follow: '448311788'}, function(stream) {
//   stream.on('data', function(event) {
//	 console.log(event && event.text);
//   });
//
//   stream.on('error', function(error) {
//	 throw error;
//   });
// });
