var fs = require("fs");

// Joke command
module.exports = {
	name: 'joke',
	description: 'Make JerryBot tell a joke.',
    execute(message) 
    {
        var jokes = fs.readFileSync('./joke.txt').toString().split("-----------------------------------------------------------------------------");
        var num_jokes = jokes.length;
        var result = Math.floor((Math.random() * num_jokes) + 1);
        message.channel.send(jokes[result]);
    },
};