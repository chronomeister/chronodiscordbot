var exports = module.exports = {};

exports.choice = function(msg, params) {
    var sep = ';';
    var resp = ['I choose you, ', "I'm going to go with ", "I choose ", "There's only one answer and that is "];
    var choices = params.join(" ").split(sep);
    if (choices.length > 1)
    msg.reply(
        resp[Math.floor(Math.random() * resp.length)] +
        choices[Math.floor(Math.random() * choices.length)]
    );
    else
    msg.reply(
        "looks like there was only one choice. That's fine if that's what you wanted, but otherwise my separator between choices is '" + sep + "'"
    );
}
