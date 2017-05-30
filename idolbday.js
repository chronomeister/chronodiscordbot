const fs = require('fs');
var request = require('request');
var idols = require('./idolbday.json');

t = new Date;
t.setTime(t.getTime()+9*60*60*1000); // can now assume UTC is jp time
bday = [];
idols.forEach(function(val, idx, ary){if (val.day == 28 && val.month == 02) {bday.push(val)}});
console.dir(bday);
