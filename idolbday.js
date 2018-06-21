const fs = require('fs');
var request = require('request');
var idols = require('./idolbday.json');

var webhooks = require('./idolwebhooks.json');

var t = new Date;
t.setTime(t.getTime()+9*60*60*1000); // can now assume UTC is jp time
var bday = [];
idols.forEach(function(val){if (val.day == t.getDate() && val.month == (t.getMonth() + 1)) {bday.push(val)}});
if (bday.length < 1) return;
var messagelst = ["Happy birthday to today's idols:"];
bday.forEach(function(val){
	var dispname = val.name + (val.seiyuu ? ", seiyuu of " + val.seiyuu : "");
	messagelst.push(`  ${dispname} from ${val.series}`);
});
webhooks.forEach(function(url){
    request.post({url:url,
        form: {
            content:messagelst.join("\n")
        }},
        function(err, rsp, body){});
});
