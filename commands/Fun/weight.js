const fs = require('fs');
const path = require('path');


// Weight command
module.exports = {
	name: 'weight',
	description: 'Keep track of your weight loss progress',
    execute(message) 
    {
        // Get all arguments
        const args = message.content.split(" ");

        // Get date
        const date_ob = new Date();
        const month = date_ob.getMonth();
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const year = date_ob.getFullYear();

        if(!(args.length > 1))
            return message.channel.send("You must supply additional argument(s) along with the weight command.");

        if(typeof(Number(args[1])) === 'number')
        {
            
            if(fs.existsSync(`/app/commands/Fun/weight/${message.author.username}.txt`))
            {
                
            }

            else
            {
                var stream = fs.createWriteStream(`/app/commands/Fun/weight/${message.author.username}.txt`);
                stream.once('open', function(fd) {
                    stream.write(`${args[1]}`);
                    stream.write(`${months[month]}`);
                    stream.write(`${year}`);
                    stream.end();
                });
            }
        }
    },
};