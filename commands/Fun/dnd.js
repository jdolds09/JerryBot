const lineReader = require('line-reader');

// DND command
module.exports = {
	name: 'dnd',
    description: 'Command use to play DND',
    execute(message) 
    {
        // Get number after !roll command if it exists
        const args = message.content.split(" ");

        if(!(args.length > 1))
        {
            return message.channel.send("You must supply an action along with the !dnd command.");
        }
        
        else
        {
            const action = args[1].toLowerCase();
            
            if(action == "campaigns")
            {
                lineReader.eachLine('./dnd/titles.txt', function(line) {
                    message.channel.send(line);
                })
            }
        }
    },
};