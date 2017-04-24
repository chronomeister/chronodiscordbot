//var exports = module.exports = {};

var auth = require('./cbotconfig.json');

var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: auth.twitterkey,
  consumer_secret: auth.twittersecret,
  bearer_token: auth.twitterbtoken
});

/**
 * Stream statuses filtered by keyword
 * number of tweets per second depends on topic popularity
 **/
 client.get('statuses/user_timeline', {screen_name: "chronomeister"}, function(error, tweets, response) {
   if(error) throw error;
   console.log(tweets);  // The favorites.
   console.log(response);  // Raw response object.
 });
