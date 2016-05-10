'use strict';

var express = require('express');
var request = require('request');

var app = express();
app.use(express.static('dist/'));
app.get('/jetty/api/v1/status', function (req, res) {
  request({
    url: 'http://ice.portal/api1/rs/status',
    headers: {
      'User-Agent': 'ice-map 0.1.1',
    }
  }).pipe(res);
});

app.listen(9000, function (err) {
  if (err) console.error(err);
  else console.log('Listening on localhost:9000');
});
