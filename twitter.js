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
var reqprom = require('request-promise-native');

var util = require('util');
// fs.appendFile('./twitter.txt', util.inspect(tweet.user.name) + "\n", () => {});
// load list to browse;
// start stream listen;
// fs.writeFile('./twitter.txt', "", () => {});
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
				var d = new Date(); fs.appendFile('./twitter.txt',  d.toUTCString() + ` New tweet : ${tweet.user.screen_name} : ${tweet.id_str}` + "\n", () => {});
				// fs.appendFile('./twitter.txt', util.inspect(tweet, {depth : 9}) + "\n", () => {});
				// console.log(tweet.text);
				var userobj = users.find(function(usertest){
					// console.log(`${usertest.id_str} === ${tweet.user.id_str}`)
					return usertest.id_str === tweet.user.id_str;
				});
				if (!userobj || tweet.retweeted_status) {fs.appendFile('./twitter.txt', "retweet" + "\n", () => {});} else
				{
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
									}, function(err, rsp, body){}
									);
								});
							}
						});
					}
				}
			}
			// if (i++ >= 10) {process.exit();}

		});

		stream.on('error', function(error) {
			console.log(error);
		});
	});
}

function preptweet(whurl, tweet) {
	// already checked rt status
	console.dir(tweet, {depth:9});
	var txt = tweet.full_text;
	var embimage;
	var addlinks = [];
	// doserial(tweet, writeurl).then();
	// check for youtube links and replace urls
	if (tweet.entities && tweet.entities.urls) {
		// tweet.entities.urls
		tweet.entities.urls.forEach((element) => {
			if (element.expanded_url.match(/youtu(\.be\/|be\.com\/)/)) {
				addlinks.push(element.expanded_url);
			}
			txt = txt.replace(element.url, element.expanded_url);
			console.log(`replace ${element.url} with ${element.expanded_url}`);
		});
	}
	// pull extended entities
	if (tweet.extended_entities) {
		// console.log("has entities");
		// console.log(`is a ${tweet.extended_entities.media[0].type} type entity`);
		switch (tweet.extended_entities.media[0].type) {
			case "video": // can only have 1
				var vidinfo = tweet.extended_entities.media.shift();
				if (vidinfo.video_info) { // could be monetized and just a check for that, will need discord to handle it
					var bigvari;
					bigvari = vidinfo.video_info.variants.reduce((largest, cur) => {
						return cur.bitrate > largest.bitrate ? cur : largest;
					});
					// console.dir(bigvari);
					addlinks.push({
						author :
							{
								name: tweet.user.screen_name,
								url: tweet.user.profile_image_url_https
							},
						url : bigvari.url,
						whurl : whurl
					});
				} else {
					addlinks.push({
						author :
							{
								name: tweet.user.screen_name,
								url: tweet.user.profile_image_url_https
							},
						url : vidinfo.expanded_url,
						whurl : whurl
					});
				}
				break;
			case "photo": // can have more than 1
				var embimgobj = tweet.extended_entities.media.shift();
				embimage = embimgobj.media_url_https;
				var regex = new RegExp(` ?${embimgobj.url}`);
				txt = txt.replace(regex, "");
				console.log(`replace ${embimgobj.url} with ""`);
				tweet.extended_entities.media.forEach((e) => {
					addlinks.push({
						author :
							{
								name: tweet.user.screen_name,
								url: tweet.user.profile_image_url_https
							},
						url : e.media_url_https,
						whurl : whurl
					});
				});
				break;
			default:
				break;
		}
	}
	var tweetobjpost = {
		txt : txt,
		embimage : embimage,
		name : tweet.user.name,
		screen_name : tweet.user.screen_name,
		profile_image_url_https : tweet.user.profile_image_url_https,
		author : tweet.user.name,
		id_str : tweet.id_str,
		whurl : whurl
	}
	console.dir(txt);
	console.dir(addlinks);
	return posttweet(tweetobjpost).then(doserial(addlinks, writeurl));
}

function posttweet(tweet) {
	return reqprom({
		method: 'POST',
		uri: tweet.whurl,
		body : {
			username: tweet.screen_name,
			avatar_url: tweet.profile_image_url_https,
			embeds : [
				{
					author: {name: `${tweet.name} (${tweet.screen_name})`, url: `https://twitter.com/${tweet.screen_name}`},
					title: `https://twitter.com/${tweet.screen_name}/status/${tweet.id_str}`,
					avatar_url: tweet.profile_image_url_https,
					color: 3513327,
					description : tweet.txt,
					image : {url : tweet.embimage},
					footer : {icon_url : "https://abs.twimg.com/icons/apple-touch-icon-192x192.png", text : "Twitter"}
				}
			],
		},
		json : true
	}).then(() => {Promise.resolve();}).catch(() => {Promise.resolve();});
}

function doserial(ary, fn) {
	return ary.reduce(function(p, item) {
		return p.then(function(){
			return fn(item);
		});
	}, Promise.resolve())
}

function writeurl(link) {
	// var vidya = tweetimage.video_info.variants.pop().url;
	// console.dir(tweet, {depth:9});

	return reqprom({
		method: 'POST',
		uri: link.whurl,
		body : {
			username: link.author.name,
			avatar_url: link.author.url,
			content : link.url
		},
		json : true
	}).then(() => {Promise.resolve();}).catch(() => {Promise.resolve();});
}
