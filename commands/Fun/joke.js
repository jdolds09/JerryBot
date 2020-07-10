const joke = require("one-liner-joke");

// Joke command
module.exports = {
	name: 'joke',
	description: 'Tells a joke.',
    execute(message) 
    {
        var randomjoke = joke.getRandomJoke();
        message.channel.send(randomjoke);
    },
};