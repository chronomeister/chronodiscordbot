const inclist = require('./testinc.json');
const loader = require('fs');
var jsonfile = require('jsonfile');

var objlist = {  "test" : "test"};

inclist.forEach(function(el) {
    var a = jsonfile.readFileSync(`./${el}`);
    console.log(JSON.parse(a));
    // objlist[b.name] = b;
})

// console.dir(objlist["idols"].desc);

// objlist["idols"].process();

///////////////////////////////////

const name = "idols";
const desc = "idolhell game";

// class atest {
//     constructor() {
//
//     }
//     process() {
//         console.log(name);
//         console.log(desc);
//     }
//     getName() {
//         return name;
//     }
// }

function atest() {
    this.desc = desc; //pulbic
}

atest.prototype.process = function () {
    console.log(name);
    console.log(desc);
};

atest.prototype.getName = function () {
    return name;
};

module.exports = atest; //which  function creates a new class
