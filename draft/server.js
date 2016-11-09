var http = require('http'); // creating server: listen and port
var fs = require('fs');
var static = require('node-static'); // work with files
var querystring = require('querystring'); // parse url
var url = require('url'); // parse url
var ndjson = require('ndjson'); // parse new line  delimeter JSON
var file = new static.Server('.', {
  cache: 0
});

var cityList = [];
fs.createReadStream('city.list.json')
  .pipe(ndjson.parse())
  .on('data', function(obj) {
    cityList.push(obj);
  })

function accept(req, res) {
  if (req.url.slice(1, 7) == 'coords') {
    var coords = decodeURI(req.url).slice(8);
    coords = JSON.parse(coords);
    coords.diff = 100;
    coords.city = '';

    cityList.forEach(function(item, i, arr) {
      var latDif = Math.abs(item.coord.lat - coords.lat);
      var lonDif = Math.abs(item.coord.lon - coords.lon);
      if (coords.diff >= latDif + lonDif) {
        coords.diff = latDif + lonDif;
        coords.city = item.name;
        coords.newLat = item.coord.lat;
        coords.newLon = item.coord.lon;
      }
    })

    res.end(JSON.stringify(coords));
  } else {
    file.serve(req, res);
  }
}

// ------ запустить сервер -------

if (!module.parent) {
  http.createServer(accept).listen(8080);
} else {
  exports.accept = accept;
}

console.log('server on port 8080')