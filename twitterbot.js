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

var twitterhistory = {};

bot.on("message", msg => {
	if(msg.author.bot){return;}
	var twitmatch = /(`|<)?https?:\/\/twitter.com\/[^/]+\/status\/([\d]+)(`|>)?/;
	var m = msg.content.match(twitmatch);
	if (m && m[2] && !(m[1] && m[3])) {
		if (!twitterhistory[msg.member.id]) {twitterhistory[msg.member.id] = {}}
		twitterhistory[msg.member.id][msg.channel.id] = [];
		var twid = m[2];
		twitclient.get(`statuses/show/${twid}`, {tweet_mode : "extended"}, function(error, tweet, response) {
			if(tweet.extended_entities) {
				function doserial(ary, fn) {
					return ary.reduce(function(p, item) {
						return p.then(function(){
							return fn(item);
						});
					}, Promise.resolve())
				}
				doserial(tweet.extended_entities.media.splice(1, tweet.extended_entities.media.length - 1), writeurl);
			}
		});
		function writeurl(tweetimage) {
			return msg.channel.send(tweetimage.media_url_https)
			.then((retmsg) => {
				twitterhistory[msg.member.id][msg.channel.id].push(retmsg.id);
			})
		}
	}
	else if (/^bad bot$/.test(msg.content)) {
		if (twitterhistory[msg.member.id] && twitterhistory[msg.member.id][msg.channel.id] && twitterhistory[msg.member.id][msg.channel.id].length > 0) {
			twitterhistory[msg.member.id][msg.channel.id].forEach((delid)=>{
				msg.channel.messages.get(delid).delete();
			});
			twitterhistory[msg.member.id][msg.channel.id] = [];
		}
	}
});
bot.on('ready', () => {
	console.log('I am ready!');
});
bot.login(configs.discordkey);
