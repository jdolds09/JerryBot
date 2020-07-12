var fs = require("fs");
var dfas = require("./")

// Joke command
module.exports = {
	name: 'joke',
	description: 'Make JerryBot tell a joke.',
    execute(message) 
    {
        fs.readFile('joke.txt', 'utf8', function(err, data) {
            if(err)
            {
                console.log(err);
                return message.channel.send(err);
            }
            
            var jokes = data.split("-----------------------------------------------------------------------------");
            var num_jokes = jokes.length;
            var result = Math.floor((Math.random() * num_jokes) + 1);
            message.channel.send(jokes[result]);
        });
    },
};