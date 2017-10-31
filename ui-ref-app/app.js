var express = require('express'),
bodyParser = require('body-parser');
const request = require('request-promise');
const serveStatic = require('serve-static');
var path = require('path')


var app = express();
app.use(bodyParser.json());

let staticServerConfig = {};
app.use(serveStatic(path.join(__dirname, 'public')))

//open in browser to see upload form
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

const serverURI = "http://micro-service-ref-app:9002";

app.get('/get', function (req, res, next) {
    const options = {
        url: `${serverURI}/get`,
        headers: {
            'cache-control': 'no-cache',
            'content-type': 'application/json',
        },
        json: true
    };
    request.get(options, (err, resp, data) => {
        const statusCode = (resp) ? resp.statusCode : 502;
        if(err || statusCode !== 200) {
            err = err || `Error getting verdict: ${statusCode}`;
            res.status(500).send(err);
        } else {
            res.json(data);
        }
    });
    
});

app.listen(9001, function () {
console.log('Example app listening on port 9001!');
});
