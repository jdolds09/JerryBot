const request = require('request');

exports.getRandomJoke = () => {
    return new Promise((resolve, reject) => {
        request('http://api.icndb.com/jokes/random', function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var dataJSON = JSON.parse(body);
                resolve(dataJSON.value.joke);
            } else {
                reject();
            }
        });
    });
};

function test() {
    console.log('test');
}