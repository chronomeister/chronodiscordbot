var exports = module.exports = {};
var request = require('request-promise-native');

exports.sat = function(msg, params) {
    var options = {
        // url : "https://www.star.nesdis.noaa.gov/GOES/conus.php?sat=G16"
        url : "https://www.star.nesdis.noaa.gov/GOES/fulldisk.php?sat=G16"
    }
    request(options)
    .then(handleData)
    .catch(handleError);

    function handleData(data) {// https://cdn.star.nesdis.noaa.gov/GOES16/ABI/FD/GEOCOLOR/20190772030_GOES16-ABI-FD-GEOCOLOR-1808x1808.jpg
        var found = data.match(/https:\/\/cdn.star.nesdis.noaa.gov\/GOES16\/ABI\/FD\/GEOCOLOR\/[\d]+_GOES16-ABI-FD-GEOCOLOR-1808x1808.jpg/)
        // var found = data.match(/https:\/\/cdn.star.nesdis.noaa.gov\/GOES16\/ABI\/CONUS\/GEOCOLOR\/[\d]+_GOES16-ABI-CONUS-GEOCOLOR-1250x750.jpg/)
        if (found && found[0]) {
            msg.channel.send(found[0]);
        } else {
            msg.channel.send("derp");
        }
        // console.dir(found);
    }
    function handleError(data) {
        console.log(data);
    }

}