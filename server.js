'use strict';

var express = require('express');
var request = require('request');

var app = express();
app.use(express.static('dist/'));
app.get('/jetty/api/v1/status', function (req, res) {
  request({
    url: 'https://portal.imice.de/api1/rs/status',
    headers: {
      'User-Agent': 'ice-map 0.1.0',
    }
  }).on('error', err => {
    if (err.code === 'ENOTFOUND') {
      console.warn(`Not found. Please check your connection and ensure you're using the onboard wifi.`);
      res.sendStatus(404);
    } else {
      throw err;
    }
  }).pipe(res);
});

app.listen(9000, function (err) {
  if (err) console.error(err);
  else console.log('Listening on localhost:9000');
});
