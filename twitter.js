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
var timeoutid; 
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
var followjoin = [];
var info = [];
users.forEach(function(e,idx){
	i++;
	client.get('users/show', {screen_name : e.user}, function(error, tweets, response) {
		var info = JSON.parse(response.body);
		// console.log(info.id_str);
		users[idx].id_str = info.id_str;
		follows.push(info.id_str);
		followjoin.push(`${e.user}:${info.id_str}`);
		if (--i == 0) {
			// console.dir(follows);
			setTimeout(start, 10000);
		}
	});
});

function reboot() {
	fs.appendFile(`./twitterdumps/error_${Date.now()}.txt`, "", () => {	
		const { exec } = require('child_process');
    	exec('pm2 restart twitter.js');
	});
}
timeoutid = setTimeout(reboot, 1000*60*62);
function start() {
	console.log(Date() + " : started");
	console.log("following: " + followjoin.join(','));
	client.stream('statuses/filter', {tweet_mode : "extended", 'follow': follows.join(',')},  function(stream) {
		stream.on('data', function(tweet) {
			if (tweet.user && follows.indexOf(tweet.user.id_str) >= 0) {
				clearTimeout(timeoutid);
				timeoutid = setTimeout(reboot, 1000*60*62);
				// console.log("new tweet: " + tweet.id_str);
				fs.appendFile(`./twitterdumps/${tweet.id_str}.txt`, util.inspect(tweet, {depth : 9}) + "\n", () => {});
				var d = new Date(); fs.appendFile('./twitter.txt',  d.toUTCString() + ` New tweet : ${tweet.user.screen_name} : ${tweet.id_str}` + "\n", () => {});
				// fs.appendFile('./twitter.txt', util.inspect(tweet, {depth : 9}) + "\n", () => {});
				var userobj = users.find(function(usertest){
					// console.log(`${usertest.id_str} === ${tweet.user.id_str}`)
					return usertest.id_str === tweet.user.id_str;
				});
				if (!userobj || tweet.retweeted_status) {fs.appendFile('./twitter.txt', "retweet" + "\n", () => {});} else
				{
					var txt = tweet.extended_tweet ? tweet.extended_tweet.full_text : tweet.text;
					if (userobj.tl) {
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
								var tl = body.data.translations[0].translatedText.replace(/"?ship"? "?(it|this)"?/ig, "KanColle");
								sendwebhooks(userobj, tweet, tl);
							}
						});
					} else {
						sendwebhooks(userobj, tweet, undefined);
					}
					if (tweet.user.screen_name === 'KanColle_STAFF' && txt.match(/申し訳ありません/)) {
						const { fork } = require('child_process');
						fork('./sorrymasen.js', txt.match(/【[0-9:：０１２３４５６７８９]+】/));
					}
				}
			}
			// if (i++ >= 10) {process.exit();}
		});

		stream.on('error', function(error) {
			fs.appendFile(`./twitterdumps/error_${Date.now()}.txt`, "", () => {});
			// console.log(error);
		});
	});
}
function sendwebhooks (userobj, tweet, tl) {
	var tweettl = tl ? JSON.parse(JSON.stringify(tl)) : tl;
	userobj.webhooks.forEach(function(url){
		// console.log("before");
		// console.log(tl);
		preptweet(url, tweet).then(() => {
			var d = new Date();
			// console.log("after");
			// console.dir(tl);
			// if (tweettl) {console.log("is TL");} else {console.log("not TL.");}
			if (tweet.user.screen_name == "kancolle_1draw2") {
				var namemap = require('./1HDnames.json');
				var txt = tweet.extended_tweet ? tweet.extended_tweet.full_text : tweet.text;
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
				// console.log(url);
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
			} else if (tweettl) {
				request.post({url:url,
					form: {
						payload_json : JSON.stringify({
							username: tweet.user.screen_name,
							avatar_url: tweet.user.profile_image_url_https,
							embeds : [
								{
									description : tweettl,
								}
							]
						})
					}
				}, function(err, rsp, body){
				});
			}
			Promise.resolve();
		});
	});
}
function preptweet(whurl, tweet) {
	// already checked rt status
	var twmediaobj = (tweet.extended_tweet ? tweet.extended_tweet.extended_entities : tweet.entities)
	// console.dir(tweet, {depth:9});
	var txt = tweet.extended_tweet ? tweet.extended_tweet.full_text : tweet.text;
	var embimage;
	var addlinks = [];
	// doserial(tweet, writeurl).then();
	// check for youtube links and replace urls
	if (twmediaobj && twmediaobj.urls) {
		// console.log("urls");
		twmediaobj.urls.forEach((element) => {
			if (element.expanded_url.match(/youtu(\.be\/|be\.com\/)/)) {
				addlinks.push(element.expanded_url);
			}
			txt = txt.replace(element.url, element.expanded_url);
			// console.log(`replace ${element.url} with ${element.expanded_url}`);
		});
	}
	// pull extended entities
	// console.log("prep tweet : " + whurl);
	if (twmediaobj && twmediaobj.media) {
		// console.log("has entities");
		// console.log(`is a ${twmediaobj.media[0].type} type entity`);
		var mediainfo = JSON.parse(JSON.stringify(twmediaobj.media));
		switch (mediainfo[0].type) {
			case "video": // can only have 1
				var vidinfo = mediainfo.shift();
				if (vidinfo.video_info) { // could be monetized and just a check for that, will need discord to handle it
					var bigvari;
					bigvari = vidinfo.video_info.variants.reduce((largest, cur) => {
						return (!largest.bitrate || (cur.bitrate && cur.bitrate > largest.bitrate) ? cur : largest);
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
					// console.dir(vidinfo.expanded_url);
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
				var embimgobj = mediainfo.shift();
				embimage = embimgobj.media_url_https;
				var regex = new RegExp(` ?${embimgobj.url}`);
				txt = txt.replace(regex, "");
				// console.log(`replace ${embimgobj.url} with ""`);
				mediainfo.forEach((e) => {
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
	var twdate = new Date(parseInt(tweet.timestamp_ms));
	var twts = twdate.toISOString();
	var tweetobjpost = {
		txt : txt,
		embimage : embimage,
		name : tweet.user.name,
		screen_name : tweet.user.screen_name,
		profile_image_url_https : tweet.user.profile_image_url_https,
		author : tweet.user.name,
		id_str : tweet.id_str,
		whurl : whurl,
		timestamp : twts
	}
	// console.dir(txt);
	// console.dir(addlinks);
	return posttweet(tweetobjpost).then(() => {
		if (addlinks.length > 0) {
			return doserial(addlinks, writeurl);
		} else {
			return Promise.resolve();
		}
	}).then(() => {
		return Promise.resolve();
	});
}

function posttweet(tweet) {
	fs.appendFile('./twitter.txt', `Post to ${tweet.whurl}` + "\n", () => {});
	return reqprom({
		method: 'POST',
		uri: tweet.whurl,
		body : {
			username: tweet.screen_name,
			avatar_url: tweet.profile_image_url_https,
			content : `<https://twitter.com/${tweet.screen_name}/status/${tweet.id_str}>`,
			embeds : [
				{
					author: {name: `${tweet.name} (@${tweet.screen_name})`, url: `https://twitter.com/${tweet.screen_name}`},
					avatar_url: tweet.profile_image_url_https,
					color: 3513327,
					description : tweet.txt,
					image : {url : tweet.embimage},
					footer : {icon_url : "https://abs.twimg.com/icons/apple-touch-icon-192x192.png", text : "Twitter"},
					timestamp : tweet.timestamp
				}
			],
		},
		json : true})
	.then(() => {return Promise.resolve();})
	.catch(() => {return Promise.resolve();});
}

function doserial(ary, fn) {
	return ary.reduce(function(p, item) {
		return p.then(function(){
			return fn(item);
		});
	}, Promise.resolve());
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
	}).then(() => {return Promise.resolve();}).catch(() => {return Promise.resolve();});
}
