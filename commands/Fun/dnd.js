const lineReader = require('line-reader');
const fs = require('fs');

// DND command
module.exports = {
	name: 'dnd',
    description: 'Command use to play DND',
    async execute(message) 
    {
        try
        {
            // Get all arguments
            const args = message.content.split(" ");
            // Number of playable campaigns
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

                // Start a campaign
                if(action == "start")
                {
                    // Display campaings
                    message.channel.send("**CAMPAIGNS**");
                    lineReader.eachLine('/app/commands/Fun/dnd/titles.txt', function(line) {
                        if(line.startsWith('-'))
                            message.channel.send(`**${line}**`);
                        else
                            message.channel.send(line);
                    });

                    // Prompt user to select specific campaign or choose a random one
                    lineReader.eachLine('/app/commands/Fun/dnd/Prompts/campaign_select.txt', function(line) {
                        if(line.startsWith('-'))
                            message.channel.send(`**${line}**`);
                        else
                            message.channel.send(line);
                    });
                }

                // If the user selects a specific campaign
                else if((Number.isInteger(Number(action))))
                {
                            // Invalid campaign selection
                    if(action > num_campaigns || action < 1)
                    {
                        return message.channel.send("Not a playable campaign");
                    }
                    
                    // Set current campaign and output the Introduction
                    else
                    {
                        const current_campaign = action;
                        lineReader.eachLine(`/app/commands/Fun/dnd/Intros/${current_campaign}.txt`, function(line) {
                            message.channel.send(line);
                        });
                    }
                }

                // If user selects a random campaign
                else if(action == "random")
                {
                    var i = 0;
                    const current_campaign = Math.floor((Math.random() * num_campaigns) + 1);
                    lineReader.eachLine(`/app/commands/Fun/dnd/Intros/${current_campaign}.txt`, function(line) {
                        if (i == 0)
                        {
                            message.channel.send(`**${line}**`);
                            i = i + 69;
                        }
                        else if(line.startsWith('-'))
                            message.channel.send(`**${line}**`);
                        else
                            message.channel.send(line);
                    });
                }

                else
                    return message.channel.send("That DND action does not exist.");
            }
        }
        catch(error)
        {
            console.log(error);
        }
    },
};