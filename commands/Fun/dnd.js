const lineReader = require('line-reader');
const fs = require('fs');

// DND command
module.exports = {
	name: 'dnd',
    description: 'Command use to play DND',
    async execute(message, server) 
    {
        try
        {
            // Persistant variables
            if(!server[message.guild.id])
            {
                server[message.guild.id] = 
                {
                    // Hangman variables
                    characters: []
                };
            }

            // Character structure
            character = 
            {
                // Character attributes
                user: "",
                name: "",
                char_class: "",
                race: "",
                strength: 8,
                dexterity: 8,
                constitution: 8,
                intelligence: 8,
                wisdom: 8,
                charisma: 8
            };

            // Playable classes and races
            const classes = ["barbarian", "bard", "cleric", "druid", "fighter", "monk", "paladin", "ranger", "rogue", "sorcerer", "warlock", "wizard"];
            const races = ["dwarf", "elf", "gnome", "halfling", "human", "orc"];

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
                    if(server[message.guild.id].characters.length == 0)
                    {
                        await message.channel.send("Please start by creating your characters.");
                        await message.channel.send("Use the **!dnd character [class] [race] [name]** command to create character.");
                        await message.channel.send("Use the **!dnd classes** and **!dnd races** commands to see playable classes and races.");
                        return await message.channel.send("Once characters are created, use the **!dnd start** command again.");
                    }

                    // Display campaings
                    await message.channel.send("**CAMPAIGNS**");
                    lineReader.eachLine('/app/commands/Fun/dnd/titles.txt', async function(line) {
                        await message.channel.send(line);
                    });

                    // Sleep the system so output displays in correct order
                    await new Promise(r => setTimeout(r, 1000));

                    // Prompt user to select specific campaign or choose a random one
                    lineReader.eachLine('/app/commands/Fun/dnd/Prompts/campaign_select.txt', async function(line) {
                        await message.channel.send(line);
                    });
                }

                // If the user selects a specific campaign
                else if((Number.isInteger(Number(action))))
                {
                    if(server[message.guild.id].characters.length == 0)
                    {
                        await message.channel.send("Please start by creating your characters.");
                        await message.channel.send("Use the **!dnd character [name] [class] [race]** command to create character.");
                        await message.channel.send("Use the **!dnd classes** and **!dnd races** commands to see playable classes and races.");
                        return await message.channel.send("Once characters are created, use the **!dnd start** command again.");
                    }

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
                    if(server[message.guild.id].characters.length == 0)
                    {
                        await message.channel.send("Please start by creating your characters.");
                        await message.channel.send("Use the **!dnd character [name] [class] [race]** command to create character.");
                        await message.channel.send("Use the **!dnd classes** and **!dnd races** commands to see playable classes and races.");
                        return await message.channel.send("Once characters are created, use the **!dnd start** command again.");
                    }

                    // Select random campaign
                    const current_campaign = Math.floor((Math.random() * num_campaigns) + 1);

                    // Output intro of campaign
                    lineReader.eachLine(`/app/commands/Fun/dnd/Intros/${current_campaign}.txt`, function(line) {
                            message.channel.send(line);
                    });
                }

                else if(action == "classes")
                {
                    // Counter variable
                    var i;

                    // Output classes
                    message.channel.send("**CLASSES**");
                    message.channel.send("**--------------------**");
                    for(i = 0; i < classes.length; i++)
                        message.channel.send(classes[i]);

                    // Sleep program so output displays correctly
                    await new Promise(r => setTimeout(r, 1000));
                    return message.channel.send("**--------------------**");
                    
                }

                else if(action == "races")
                {
                    // Counter variable
                    var i;

                    // Output classes
                    message.channel.send("**RACES**");
                    message.channel.send("**--------------------**");
                    for(i = 0; i < races.length; i++)
                        message.channel.send(races[i]);

                    // Sleep program so output displays correctly
                    await new Promise(r => setTimeout(r, 1000));
                    return message.channel.send("**--------------------**");
                    
                }

                else if(action == "character")
                {
                    // User provided invalid number of arguments
                    if(args.length != 5)
                    {
                        message.channel.send("Invalid number of arguments provided with !dnd character command");
                        return message.channel.send("Use the **!dnd character \"[name]\" [class] [race]** command to create character.");
                    }

                    // Get player name
                    if(!(args[2].starsWith("\"")))
                        return message.channel.send("Please put your character name between quotation marks. \"character name\".");

                    var name = args[2].substring(1);
                    var i = 3;

                    while(!(args[i].endsWith("\"")))
                    {
                        name = name.concat(` ${args[i]}`);
                        i = i + 1;
                    }

                    var name = args[i].substring(0, args[i].length - 1);
                    message.channel.send(name);

                    /*
                    const char_class = args[3].toLowerCase();
                    const race = args[4].toLowerCase();

                    
                    if(classes.indexOf(char_class))
                    {

                    }
                    */
                }

                // Invalid action provided
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