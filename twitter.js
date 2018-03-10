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
var whconfig = require('./webhookconfig.json');

// load list to browse;
// start stream listen;
client.stream('statuses/filter', {track: 'twitter'},  function(stream) {
	stream.on('data', function(tweet) {
		// var util = require('util');
		// fs.appendFile('./twitter.txt', util.inspect(tweet) + "\n");
	});

	stream.on('error', function(error) {
		console.log(error);
	});
});
