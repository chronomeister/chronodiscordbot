var funcs = [];
for (var i = 0; i < 4; i++){
    let a = i;
    let to = new Promise((rs,rj) => {
        setTimeout(() => {console.dir([a,i]); rs();}, a*1000);
    });
    funcs.push(to);
}
console.log("out");
Promise.all(funcs).then( () => {console.log("done");});
console.log("end");
