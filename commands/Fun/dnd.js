const lineReader = require('line-reader');
const fs = require('fs');

// DND command
module.exports = {
	name: 'dnd',
    description: 'Command use to play DND',
    execute(message) 
    {
        // Get number after !roll command if it exists
        const args = message.content.split(" ");
        // number of playable campaigns
        const num_campaigns = 1;

        // User must supply an action along with the dnd command
        if(!(args.length > 1))
        {
            return message.channel.send("You must supply an action along with the !dnd command.");
        }
        
        // Execute dnd actions
        else
        {
            // Make all letters in supplied action to lower case
            const action = args[1].toLowerCase();
            
            // List all playable campaings
            if(action == "campaigns")
            {
                lineReader.eachLine('/app/commands/Fun/dnd/titles.txt', function(line) {
                    message.channel.send(line);
                });
            }

            // Start a campaign
            else if(action == "start")
            {
                // If the user selects a specific campaign
                if(args.length > 2)
                {
                    if((Number.isInteger(Number(args[2]))))
                    {
                        // Invalid campaign selection
                        if(args[2] > num_campaigns || args[2] < 1)
                        {
                            return message.channel.send("Not a playable campaign");
                        }
                        
                        // Set current campaign and output the Introduction
                        else
                        {
                            const current_campaign = args[2];
                            const intro = fs.readFileSync(`/app/commands/Fun/dnd/Intros/${current_campaign}.txt`, 'utf8')
                            message.channel.send(intro);
                        }
                    }
                }
                
                // Choose a random campaign
                else
                {
                    const current_campaign = Math.floor((Math.random() * num_campaigns) + 1);
                    const intro = fs.readFileSync(`app/commands/Fun/dnd/Intros/${current_campaign}.txt`)
                    message.channel.send(intro); 
                }
            }
        }
    },
};