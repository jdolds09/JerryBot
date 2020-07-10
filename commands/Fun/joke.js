const joke = require("random-jokes-gen");

// Joke command
module.exports = {
	name: 'joke',
	description: 'Tells a joke.',
    execute(message) 
    {
        try
        {
            joke.getRandomJoke(function(randomjoke)
            {
                message.channel.send(randomjoke);
            });
            
        }
        catch(error)
        {
            console.log(error);
            message.channel.send(error);
        }
    },
};