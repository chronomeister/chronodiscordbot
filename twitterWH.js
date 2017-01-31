var request = require('request');

request.post({url:'https://discordapp.com/api/webhooks/273124540417048577/M_P4HuQstYFYy_WFxWrgF83BUw1-q80LD52yEs2SfCZJCvmstc3SJLCaCO6Kw5eieRf0',
    form: {
        content:'Muri'
    }},
    function(err, rsp, body){console.dir(rsp);console.dir(err);console.dir(body);}
);
