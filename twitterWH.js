var request = require('request');

// request.post({url:'https://discordapp.com/api/webhooks/273124540417048577/M_P4HuQstYFYy_WFxWrgF83BUw1-q80LD52yEs2SfCZJCvmstc3SJLCaCO6Kw5eieRf0',
//     form: {
//         content:'Muri'
//     }},
//     function(err, rsp, body){console.dir(rsp);console.dir(err);console.dir(body);}
// );
//Install this module to send easily your requests
var auth = require('./cbotconfig.json');

var a = Buffer(auth.twitterkey + ':' + auth.twittersecret).toString('base64');
request.post({
    url : 'https://api.twitter.com/oauth2/token',
    headers : {
        'Authorization': 'Basic '+ a,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body : 'grant_type=client_credentials'
}, function (error, response, html) {
    console.log(JSON.parse(response.body).access_token);
});
