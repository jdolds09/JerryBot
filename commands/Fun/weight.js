fs = require('fs');

// Weight command
module.exports = {
	name: 'weight',
	description: 'Keep track of your weight loss progress',
    execute(message) 
    {
        // Get all arguments
        const args = message.content.split(" ");

        if(!(args.length > 1))
            return message.channel.send("You must supply additional argument(s) along with the weight command.");

        if(typeof(Number(args[1])) === 'number')
        {
            message.channel.send("fuck");
            fs.writeFile(`./weight/${message.author.username}.txt`, args[1], function (err) {
                if (err) return console.log(err);
            });
            return message.channel.send("added file");
        }
    },
};