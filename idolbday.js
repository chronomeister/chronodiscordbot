const fs = require('fs');
var request = require('request');
var idols = require('./idolbday.json');

webhooks = [
    "https://discordapp.com/api/webhooks/319233359563980801/f2CMzyyrXQXHZ-q2z-EdpRn4l0kx5CYAao73lTWItILIKT-seqzyAg2kdPNy-Ge6vLrS",
    "https://discordapp.com/api/webhooks/309148289620639755/xJfhIfAP400QmIj3VWEvco75DeNe-xytekYOXJvf87iJ3csu1c3h0DQyivueDykBCVHz"
]

t = new Date;
t.setTime(t.getTime()+9*60*60*1000); // can now assume UTC is jp time
bday = [];
idols.forEach(function(val){if (val.day == t.getDate() && val.month == (t.getMonth() + 1)) {bday.push(val)}});
console.dir(bday);
if (bday.length < 1) return;
messagelst = ["Happy birthday to today's idols:"];
bday.forEach(function(val){messagelst.push(`${val.name} from ${val.series}`)});
webhooks.forEach(function(url){
    request.post({url:url,
        form: {
            content:messagelst.join("\n")
        }},
        function(err, rsp, body){});
});
