const inclist = require('./testinc.json');

var objlist = {};

inclist.forEach(function(el) {
    var a = require(`./${el}`);
    var b = new a();
    objlist[b.getName()] = b;
})

console.dir(objlist["idols"].desc);

objlist["idols"].process();

// const t2 = require('./test2.js');
// var t = new t2();
// console.dir(t.msg);
// console.dir(t.name);
// t.testing();
