const joke = require("one-liner-joke");

// Joke command
module.exports = {
	name: 'joke',
	description: 'Tells a joke.',
    execute(message) 
    {
        try
        {
            var randomjoke = joke.getRandomJoke();
            message.channel.send(randomjoke);
        }
        catch(error)
        {
            console.log(error);
            message.channel.send(error);
        }
    },
};