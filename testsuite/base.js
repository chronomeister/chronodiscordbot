var exports = module.exports = {};
function discordFunction() {
    this.name = "<noname>";
    this.desc = "<nodesc>";
}

discordFunction.prototype.process = function () {
    console.log("Hello World!");
};

discordFunction.prototype.getName = function () {
    return this.name;
};

module.exports discordFunction;
