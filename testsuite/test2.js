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
