var exports = module.exports = {};

exports.choice = function(msg, params) {
    var resp = ['I choose you, ', "I'm going to go with ", "I choose ", "There's only one answer and that is "];
    var choices = params.join(" ").split(';');
    msg.reply(
        resp[Math.floor(Math.random() * resp.length)] +
        choices[Math.floor(Math.random() * choices.length)]
    );
}
