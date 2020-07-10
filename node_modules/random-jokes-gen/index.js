var request = require('request');
var bodyParser = require('body-parser');
var express = require('express');

var app = express();
app.use(bodyParser().json());

exports.getDadJoke = function (joke) {
  var config = {
    url: 'https://icanhazdadjoke.com',
    headers: {
      'Accept': 'application/json'
    }
  };

  request(config, function(err, response, body) {
    if (!err && response.statusCode === 200) {
      var dataJSON = JSON.parse(body);
      joke(dataJSON.joke);
    }
  });
}

exports.getProgrammingJoke = function(joke) {

  var config = {
    url: 'https://official-joke-api.appspot.com/jokes/programming/random'
  };

  request(config, function(err, response, body) {
    if(!err && response.statusCode === 200) {
      var dataJSON = JSON.parse(body);

      joke((dataJSON[0].setup)+"\n\n"+(dataJSON[0].punchline));
    }
  });
}

exports.getRandomJoke = function(joke) {

  var config = {
    url: 'https://official-joke-api.appspot.com/random_joke'
  };

  request(config, function(err, response, body) {
    if(!err && response.statusCode === 200) {
      var dataJSON = JSON.parse(body);

      joke(dataJSON.setup + "\n\n" + dataJSON.punchline);
    }
  });
}

