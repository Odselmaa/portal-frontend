var connection = require('./connection.js')
var router = connection.router
var request = require('request');
var moment = require('moment');
var url = require('../url.js')

function makeRequest(options) {
    var promise = new Promise((resolve, reject)=>{
        var startDate = moment();
        request(options, function (error, response, body) {
            var endDate = moment();
            diff = endDate.diff(startDate) / 1000
            console.log('Request took: ' + diff);
            resolve(diff)
        });
    })
    return promise
}

var test_handler = function(req, res){
    var number = parseInt(req.query.limit!==undefined?req.query.limit:10)
    console.log(number)
    var startDate1 = moment();
    var options = {
        uri: url.API_URL + 'user/5a63ac19b1cd8e29bf0c0c77?&fields=firstname,lastname',
        headers: {
            "Authorization": "Bearer " + req.session.access_token.token
        },
        timeout: 1000 * 100
    }

    var promises = []
    for (var i = 0; i < number; i++) {
        promises.push(makeRequest(options));
    }
    Promise.all(promises).then(function(values) {
        var avg = (arrSum(values)/number)
        var endDate1 = moment();
        diff1 = endDate1.diff(startDate1) / 1000
        console.log('Total request took: ' + diff1);

        res.json({avg:avg})

    });

}
const arrSum = arr => arr.reduce((a,b) => a + b, 0)

router.get('/test',test_handler)

module.exports = router;
