"use strict";
var Discord = require("discord.js");
var configs = require('./twitterbot.json');
var Twitter = require('twitter');
var bot = new Discord.Client();
const fs = require('fs');
const util = require('util');

var twitclient = new Twitter({
  consumer_key: configs.twitterkey,
  consumer_secret: configs.twittersecret,
  bearer_token: configs.twitterbtoken
});

bot.on("message", msg => {
	var twitmatch = /`?https?:\/\/twitter.com\/[^/]+\/status\/([\d]+)/;
	var m = msg.content.match(twitmatch);
	if (m && m[0] && m[0][0] !== '`') {
		var twid = m[1];
		twitclient.get(`statuses/show/${twid}`, {tweet_mode : "extended"}, function(error, tweet, response) {
			if(tweet.extended_entities) {
				function doserial(ary, fn) {
					return ary.reduce(function(p, item) {
						return p.then(function(){
							return fn(item);
						});
					}, Promise.resolve())
				}
				doserial(tweet.extended_entities.media.splice(1, tweet.extended_entities.media.length - 1), writeurl).then();
			}
		});

		function writeurl(tweetimage) {
			return msg.channel.send(tweetimage.media_url_https);
		}
	}
});
bot.on('ready', () => {
	console.log('I am ready!');
});
bot.login(configs.discordkey);
