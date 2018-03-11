var auth = require('./cbotconfig.json');
const fs = require('fs');
var Twitter = require('twitter');
var request = require('request');
var client = new Twitter({
	consumer_key: auth.twitterkey,
	consumer_secret: auth.twittersecret,
	access_token_key: auth.twitteratoken,
	access_token_secret: auth.twitterasecret,
});
var twconfig = require('./followtwitter.json');

var util = require('util');
// fs.appendFile('./twitter.txt', util.inspect(tweet.user.name) + "\n", () => {});
// load list to browse;
// start stream listen;
fs.writeFile('./twitter.txt', "", () => {});
var i = 0;
var users = twconfig.list;
var follows = [];
var info = [];
users.forEach(function(e,idx){
	i++;
	client.get('users/show', {screen_name : e.user}, function(error, tweets, response) {
		var info = JSON.parse(response.body);
		// console.log(info.id_str);
		users[idx].id_str = info.id_str;
		follows.push(info.id_str);
		if (--i == 0) {
			// console.dir(follows);
			start();
		}
	});
});

function start() {
	console.log("started");
	client.stream('statuses/filter', {tweet_mode : "extended", 'follow': follows.join(',')},  function(stream) {
		stream.on('data', function(tweet) {
			if (tweet.user && follows.indexOf(tweet.user.id_str) >= 0) {
				fs.appendFile('./twitter.txt', `New tweet : ${tweet.user.screen_name} : ${tweet.id_str}` + "\n", () => {});
				// fs.appendFile('./twitter.txt', util.inspect(tweet, {depth : 9}) + "\n", () => {});
				var embimage = "";
				var embvideo = "";
				var imgcount = "";
				if (tweet.extended_tweet && tweet.extended_tweet.entities && tweet.extended_tweet.entities.media) {
					// console.log("extended_tweet");
					embimage = tweet.extended_tweet.entities.media[0].media_url_https;
					if (tweet.extended_tweet.entities.media[0].video_info) {
						embvideo = " (has video embeded)";
					} else {
						var addimgs = tweet.extended_tweet.entities.media.length - 1;
						// console.dir(tweet.extended_tweet);
						imgcount = tweet.extended_tweet.entities.media.length > 1 ? ` (contains ${addimgs} additional image${addimgs == 1 ? "" : "s"})` : "";
					}
				} else if (tweet.extended_entities && tweet.extended_entities.media) {
					// console.log("extended_entities");
					embimage = tweet.extended_entities.media[0].media_url_https;
					if (tweet.extended_entities.media[0].video_info) {
						embvideo = " (has video embeded)";
					} else {
						var addimgs = tweet.extended_entities.media.length - 1;
						// console.dir(tweet.extended_entities.media.constructor);
						imgcount = tweet.extended_entities.media.length > 1 ? ` (contains ${addimgs} additional image${addimgs == 1 ? "" : "s"})` : "";
					}
				} else if (tweet.entities && tweet.entities.media) {
					// console.log("entities");
					embimage = tweet.entities.media[0].media_url_https;
					var addimgs = tweet.entities.media.length - 1;
					imgcount = tweet.entities.media.length > 1 ? ` (contains ${addimgs} additional image${addimgs == 1 ? "" : "s"})` : "";
				}
				// console.log(tweet.text);
				var userobj = users.find(function(usertest){
					// console.log(`${usertest.id_str} === ${tweet.user.id_str}`)
					return usertest.id_str === tweet.user.id_str;
				});
				if (!userobj) {return;}
				var txt = tweet.extended_tweet ? tweet.extended_tweet.full_text : tweet.text;
				userobj.webhooks.forEach(function(url){
					request.post({url:url,
						form: {
							payload_json : JSON.stringify({
								username: tweet.user.screen_name,
								avatar_url: tweet.user.profile_image_url_https,
								embeds : [
									{
										author: {name: `${tweet.user.name} (${tweet.user.screen_name})`, url: `https://twitter.com/${tweet.user.screen_name}`},
										title: `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`,
										avatar_url: tweet.user.profile_image_url_https,
										color: 3513327,
										description : txt,
										image : {url : embimage},
										footer : {icon_url : "https://abs.twimg.com/icons/apple-touch-icon-192x192.png", text : "Twitter" + embvideo + imgcount}
									}
								],
							})
						},
						function(err, rsp, body){}
					});
				});
				if (tweet.user.screen_name == "kancolle_1draw") {
					var namemap = require('./1HDnames.json');
					var match = (txt.match(/お題は ([^\r\n]+) .なります/));
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
						default:
						enlist[enlist.length - 1] = "and " + enlist[enlist.length - 1];
						tl = "Looks like today's 1HD is " + enlist.join(", ");
						break;
					}
					userobj.webhooks.forEach(function(url){
						request.post({url:url,
							form: {
								payload_json : JSON.stringify({
									username: tweet.user.screen_name,
									avatar_url: tweet.user.profile_image_url_https,
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
				} else if (userobj.tl) {
					request.post({
						url : "https://translation.googleapis.com/language/translate/v2",
						qs : { "key" : auth.gkey },
						form : {
							"q" : txt,
							"format" : "text",
							"source" : tweet.lang,
							"target" : "en"
						}
					}, function (error, rsp, html) {
						var body = JSON.parse(rsp.body);
						if (body.data) {
							var tl = body.data.translations[0].translatedText.replace(/"?ship"? (it|this)/ig, "KanColle");
							userobj.webhooks.forEach(function(url){
								request.post({url:url,
									form: {
										payload_json : JSON.stringify({
											username: tweet.user.screen_name,
											avatar_url: tweet.user.profile_image_url_https,
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
						}
					});
				}
			}
			// if (i++ >= 10) {process.exit();}

		});

		stream.on('error', function(error) {
			console.log(error);
		});
	});
}
