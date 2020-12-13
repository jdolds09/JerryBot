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
            // Persistant variables specific to a discord server
            if(!server[message.guild.id])
            {
                server[message.guild.id] = 
                {
                    // Persistant variables
                    characters: [],
                    players: [],
                    i: 0
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
                lvl: 1,
                xp_to_lvl: 300,
                strength: 8,
                dexterity: 8,
                constitution: 8,
                intelligence: 8,
                wisdom: 8,
                charisma: 8,
                hit_points: 8,
                armor_class: 0,
                armor_proficiencies: [],
                weapon_proficiencies: [],
                tools: [],
                saving_throws: [],
                skills: [],
                items: [],
                weapons: [],
                armor: [],
                weapons_equipped: [],
                armor_equipped: []
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
                return message.channel.send("You must supply an action along with the !dnd command.");
            
            // Execute dnd actions
            else
            {
                // Make all letters in supplied action to lower case
                const action = args[1].toLowerCase();

                // ******************************** START ACTION **********************************************
                if(action == "start")
                {
                    // Prompt players to create their characters first before starting an adventure
                    if(server[message.guild.id].characters.length == 0)
                    {
                        await message.channel.send("Please start by creating your characters.");
                        await message.channel.send("Use the **!dnd character \"[name]\" [class] [race]** command to create character.");
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

                // ******************************** START SPECIFIC CAMPAIGN **********************************************
                else if((Number.isInteger(Number(action))))
                {
                    // Prompt players to create their characters first before starting an adventure
                    if(server[message.guild.id].characters.length == 0)
                    {
                        await message.channel.send("Please start by creating your characters.");
                        await message.channel.send("Use the **!dnd character \"[name]\" [class] [race]** command to create character.");
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

                // ******************************** START RANDOM CAMPAIGN **********************************************
                else if(action == "random")
                {
                    // Prompt players to create a character first before starting an adventure
                    if(server[message.guild.id].characters.length == 0)
                    {
                        await message.channel.send("Please start by creating your characters.");
                        await message.channel.send("Use the **!dnd character \"[name]\" [class] [race]** command to create character.");
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

                // ******************************** LIST CLASSES **********************************************
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

                // ******************************** LIST RACES **********************************************
                else if(action == "races")
                {
                    // Counter variable
                    var i;

                    // Output races
                    message.channel.send("**RACES**");
                    message.channel.send("**--------------------**");
                    for(i = 0; i < races.length; i++)
                        message.channel.send(races[i]);

                    // Sleep program so output displays correctly
                    await new Promise(r => setTimeout(r, 1000));
                    return message.channel.send("**--------------------**");
                    
                }

                // ******************************** DISPLAY CHARACTER'S WEAPONS **********************************************
                else if(action == "weapons")
                {
                    // Find player
                    var i;
                    var j = server[message.guild.id].players.indexOf(message.author.username);
                    var char = server[message.guild.id].characters[j];

                    // Weapons header
                    message.channel.send(`**${char.name}'s WEAPONS**`);
                    message.channel.send("**---------------------------**");
                    // Character has no weapons
                    if(char.weapons.length == 0 && char.weapons_equipped.length == 0)
                        return message.channel.send("None");
                    

                    // Output weapons
                    message.channel.send("**__Name:__**\t\t**__Hand:__**\t**__Dmg:__**");
                    for(i = 0; i < char.weapons_equipped.length; i++)
                        message.channel.send(`**${char.weapons_equipped[i].name.charAt(0).toUpperCase() + char.weapons_equipped[i].name.slice(1)}**\t${char.weapons_equipped[i].hand}\t${char.weapons_equipped[i].damage}`);
                    for(i = 0; i < char.weapons.length; i++)
                        message.channel.send(`${char.weapons[i].name.charAt(0).toUpperCase() + char.weapons[i].name.slice(1)}\t${char.weapons[i].hand}\t${char.weapons[i].damage}`);
                    
                    message.channel.send("*Weapons in bold are weapons that are currently equipped.");
                    return message.channel.send("**---------------------------**");
                }

                // ******************************** DISPLAY CHARACTER'S ARMOR **********************************************
                else if(action == "armor")
                {
                    // Find player
                    var i;
                    var j = server[message.guild.id].players.indexOf(message.author.username);
                    var char = server[message.guild.id].characters[j];

                    // Armor header
                    message.channel.send(`**${char.name}'s ARMOR**`);
                    message.channel.send("**---------------------------**");
                    // Character has no armor
                    if(char.armor.length == 0 && char.armor.length == 0)
                        message.channel.send("None");

                    // Output armor
                    message.channel.send("**__Name:__**\t**__Type:__**\t**__AC:__**");
                    for(i = 0; i < char.armor_equipped.length; i++)
                        message.channel.send(`**${char.armor_equipped[i].name.charAt(0).toUpperCase() + char.armor_equipped[i].name.slice(1)}**\t${char.armor_equipped[i].type}\t${char.armor_equipped[i].ac}`);
                    for(i = 0; i < char.armor.length; i++)
                        message.channel.send(`${char.armor[i].name.charAt(0).toUpperCase() + char.armor[i].name.slice(1)}\t${char.armor[i].type}\t${char.armor[i].ac}`);
                    
                    message.channel.send("*Armor in bold is armor currently equipped.");
                    return message.channel.send("**---------------------------**");
                }

                // ******************************** DISPLAY CHARACTER'S ITEMS **********************************************
                else if(action == "items")
                {
                    // Find player
                    var i;
                    var j = server[message.guild.id].players.indexOf(message.author.username);
                    var char = server[message.guild.id].characters[j];

                    // Items header
                    message.channel.send(`**${char.name}'s ITEMS**`);
                    message.channel.send("**---------------------------**");
                    // Character has no items
                    if(char.items.length == 0)
                        message.channel.send("None");

                    // Output items
                    for(i = 0; i < char.items.length; i++)
                    {
                        if(char.items[i].amount > 1)
                            message.channel.send(`${char.items[i].name.charAt(0).toUpperCase() + char.items[i].name.slice(1)} x${char.items[i].amount}`);
                        else
                            message.channel.send(`${char.items[i].name.charAt(0).toUpperCase() + char.items[i].name.slice(1)}`);
                    }
                    return message.channel.send("**---------------------------**");
                }

                // ******************************** DISPLAY CHARACTER'S TOOLS **********************************************
                else if(action == "tools")
                {
                    // Find player
                    var i;
                    var j = server[message.guild.id].players.indexOf(message.author.username);
                    var char = server[message.guild.id].characters[j];

                    // Tools header
                    message.channel.send(`**${char.name}'s TOOLS**`);
                    message.channel.send("**---------------------------**");
                    // Character has no tools
                    if(char.tools.length == 0)
                        message.channel.send("None");

                    // Output tools
                    for(i = 0; i < char.tools.length; i++)
                    {
                        if(char.tools[i].amount > 1)
                            message.channel.send(`${char.tools[i].name.charAt(0).toUpperCase() + char.tools[i].name.slice(1)} x${char.tools[i].amount}`);
                        else
                            message.channel.send(`${char.tools[i].name.charAt(0).toUpperCase() + char.tools[i].name.slice(1)}`);
                    }
                    return message.channel.send("**---------------------------**");
                }

                // ******************************** EQUIP WEAPON/ARMOR **********************************************
                else if(action == "equip")
                {
                    // Counters
                    var i = 3;
                    var k;
                    var position;
                    // Find player
                    var j = server[message.guild.id].players.indexOf(message.author.username);
                    var char = server[message.guild.id].characters[j];
                    // Boolean variable for if weapon/armor exists
                    var exists = false;
                    // See if player has shield equipped
                    var shield_equipped = false;
                    
                    for(k = 0; k < char.armor_equipped.length; k++)
                    {
                        if(char.armor_equipped[k].type == "shield")
                            shield_equipped = true;
                    }

                    // User didn't supply enough arguments 
                    if(args.length < 4)
                    {
                        message.channel.send("Insufficient arguments supplied with **!dnd equip** command.");
                        return message.channel.send("To equip armor or a weapon, use the **!dnd equip [weapon/armor] \"[weapon/armor name]\" [offhand] <--(optional argument, must be a light weapon or shield)**");
                    }

                    // Gear variable will be equal to "weapon" or "armor" specifing what is being equipped
                    var gear_type = args[2].toLowerCase();
                    // User didn't specify if armor or weapon is being equipped
                    if(gear_type != "weapon" && gear_type != "armor")
                    {
                        message.channel.send("Please specify if a weapon or armor is being equipped.");
                        return message.channel.send("To equip armor or a weapon, use the **!dnd equip [weapon/armor] \"[weapon/armor name]\" [offhand] <--(optional argument, must be a light weapon to put in offhand)**");
                    }

                    // Get name of item being equipped
                    if(!(args[3].charAt(0) == "\""))
                        return message.channel.send("Please put the name of the armor or weapon between quotation marks. \"weapon/armor name\".");

                    var gear_name = args[3].substring(1);

                    // If name of weapon or armor is only one word or contains no spaces
                    if(gear_name.charAt(gear_name.length - 1) == "\"")
                        gear_name = gear_name.substring(0, gear_name.length - 1);
                    
                    // Name of weapon/armor has spaces
                    else
                    {
                        i = 4;

                        while(!(args[i].charAt(args[i].length - 1) == "\""))
                        {
                            gear_name = gear_name.concat(` ${args[i]}`);
                            i = i + 1;
                            if(i == args.length)
                                return message.channel.send("Please put the name of the armor or weapon between quotation marks. \"weapon/armor name\".");
                        }

                        gear_name = gear_name.concat(` ${args[i].substring(0, args[i].length - 1)}`);
                    }

                    // Set letters of item being equipped to lower case
                    gear_name = gear_name.toLowerCase();

                    // Player wants to equip weapon in offhand
                    if((i + 1 == args.length - 1) && gear_type == "weapon")
                    {
                        if(args[i + 1].toLowerCase() == "offhand")
                        {
                            // See if player has weapon to equip
                            for(i = 0; i < char.weapons.length; i++)
                            {
                                if(char.weapons[i].name == gear_name)
                                {
                                    exists = true;
                                    position = i;
                                }
                            }
                            // Player wants to equip weapon in offhand   
                            if(exists)
                            {
                                // Player tried to equip a weapon in the offhand with nothing in the mainhand
                                if(char.weapons_equipped.length == 0)
                                    return message.channel.send("Please equip a mainhand weapon first.");

                                // Weapon in mainhand is not light
                                if(char.weapons_equipped[0].light == false)
                                    return message.channel.send("Weapon in mainhand must be light to dual wield.");

                                // Weapon that the player wants to equip in the offhand is not light
                                if(char.weapons[position].light == false)
                                    return message.channel.send("Weapon must be a light weapon to be equipped in the offhand.");
                            
                                // Equip weapon in empty offhand
                                if(char.weapons_equipped.length == 1)
                                {
                                    // If shield is equipped
                                    if(shield_equipped)
                                    {
                                        for(k = 0; k < char.armor_equipped.length; k++)
                                        {
                                            // Unequip shield
                                            if(char.armor_equipped[k].type == "shield")
                                            {
                                                message.channel.send(`${char.armor_equipped[k].name} was unequipped.`);
                                                char.armor.push(char.armor_equipped[k]);
                                                char.armor_equipped.splice(k, 1);
                                            }
                                        }
                                    }
                                    // Player does not have a shield equipped
                                    else
                                    {
                                        char.weapons_equipped.push(char.weapons[position]);
                                        char.weapons.splice(position, 1);
                                        return message.channel.send(`${gear_name} was equipped in the offhand.`);
                                    }
                                }
                                // Replace weapon that's already in offhand
                                else
                                {
                                    message.channel.send(`${char.weapons_equipped[1].name} in the offhand was unequipped.`);
                                    char.weapons.push(char.weapons_equipped[1]);
                                    char.weapons_equipped[1] = char.weapons[position];
                                    char.weapons.splice(position, 1);
                                    return message.channel.send(`${gear_name} was equipped in the offhand.`);
                                }
                            }
                        }
                    }

                    // See if player has weapon to equip
                    exists = false;
                    for(i = 0; i < char.weapons.length; i++)
                    {
                        if(char.weapons[i].name == gear_name)
                        {
                            exists = true;
                            position = i;
                        }
                    }

                    // Equip weapon in the main hand
                    if(exists)
                    {
                        // If weapon that player wants to equip is light
                        if(char.weapons[position].light == true)
                        {
                            // Replace the weapon that is already in the mainhand
                            if(char.weapons_equipped.length > 0)
                            {
                                message.channel.send(`${char.weapons_equipped[0].name} was unequipped.`);
                                char.weapons.push(char.weapons_equipped[0]);
                                char.weapons_equipped[0] = char.weapons[position];
                                char.weapons.splice(position, 1);
                                return message.channel.send(`${gear_name} was equipped.`);
                            }
                            
                            // No weapons are equipped
                            else
                            {
                                // Equip weapon
                                char.weapons_equipped.push(char.weapons[position]);
                                char.weapons.splice(position, 1);
                                return message.channel.send(`${gear_name} was equipped.`);
                            }
                        }

                        // Weapon that player wants to equip is not light
                        else
                        {
                            // Player has weapon(s) equipped
                            if(char.weapons_equipped.length > 0)
                            {
                                // Player is currently dual wielding
                                if(char.weapons_equipped.length == 2)
                                {
                                    message.channel.send(`${char.weapons_equipped[1].name} was unequipped`);
                                    char.weapons.push(char.weapons_equipped[1]);
                                    char.weapons_equipped.pop();
                                    message.channel.send(`${char.weapons_equipped[0].name} was unequipped`);
                                    char.weapons.push(char.weapons_equipped[0]);
                                    char.weapons_equipped[0] = char.weapons[position];
                                    char.weapons.splice(position, 1);
                                    return message.channel.send(`${gear_name} was equipped.`);
                                }
                                // Player is not dual wielding
                                else
                                {
                                    // Player has shield equipped
                                    if(shield_equipped)
                                    {
                                        if(char.weapons[position].hand == "2h")
                                        {
                                            for(k = 0; k < char.armor_equipped.length; k++)
                                            {
                                                // Unequip shield
                                                if(char.armor_equipped[k].type == "shield")
                                                {
                                                    message.channel.send(`${char.armor_equipped[k].name} was unequipped.`);
                                                    char.armor.push(char.armor_equipped[k]);
                                                    char.armor_equipped.splice(k, 1);
                                                }
                                            }
                                        }
                                    }
                                    // Equip weapon
                                    message.channel.send(`${char.weapons_equipped[0].name} was unequipped`);   
                                    char.weapons.push(char.weapons_equipped[0]);
                                    char.weapons_equipped[0] = char.weapons[position];
                                    char.weapons.splice(position, 1);
                                    return message.channel.send(`${gear_name} was equipped.`);
                                }
                            }

                            // Player does not have a weapon equipped
                            else
                            {
                                // Player has shield equipped
                                if(shield_equipped)
                                {
                                    if(char.weapons[char.weapons.indexOf(gear_name)].hand == "2h")
                                    {
                                        for(k = 0; k < char.armor_equipped.length; k++)
                                        {
                                            // Unequip shield
                                            if(char.armor_equipped[k].type == "shield")
                                            {
                                                 message.channel.send(`${char.armor_equipped[k].name} was unequipped.`);
                                                 char.armor.push(char.armor_equipped[k]);
                                                 char.armor_equipped.splice(k, 1);
                                            }
                                        }
                                    }
                                }
                                // Equip weapon
                                char.weapons_equipped.push(char.weapons[position]);
                                char.weapons.splice(position, 1);
                                return message.channel.send(`${gear_name} was equipped.`);
                            }
                        }
                    }

                    // See if player has armor to equip
                    exists = false;
                    for(i = 0; i < char.armor.length; i++)
                    {
                        if(char.armor[i].name == gear_name)
                        {
                            exists = true;
                            position = i;
                        }
                    }


                    // Equip armor
                    if(exists)
                    {
                        // Player wants to equip a shield
                        if(char.armor[char.armor.indexOf(gear_name)].type == "shield")
                        {
                            // Character has weapons equipped
                            if(char.weapons_equipped.length > 0)
                            {
                                // Character has 2h weapon equipped
                                if(char.weapons_equipped[0].hand == "2h")
                                {
                                    message.channel.send(`${char.weapons_equipped[0].name} was unequipped`);
                                    char.weapons.push(char.weapons_equipped[0]);
                                    char.weapons_equipped.pop();
                                }

                                // Character is dual wielding
                                if(char.weapons_equipped.length == 2)
                                {
                                    message.channel.send(`${char.weapons_equipped[1].name} was unequipped.`);
                                    char.weapons.push(char.weapons_equipped[1]);
                                    char.weapons_equipped.pop();
                                }

                                // If player has shield equipped
                                if(shield_equipped)
                                {
                                    for(k = 0; k < char.armor_equipped.length; k++)
                                        {
                                            // Unequip shield
                                            if(char.armor_equipped[k].type == "shield")
                                            {
                                                 message.channel.send(`${char.armor_equipped[k].name} was unequipped.`);
                                                 char.armor.push(char.armor_equipped[k]);
                                                 char.armor_equipped.splice(k, 1);
                                            }
                                        }
                                }

                                // Equip shield
                                char.armor_equipped.push(char.armor[position]);
                                char.armor.splice(position, 1);
                                return message.channel.send(`${gear_name} was equipped.`);
                            }
                        }

                        // Player wants to equip armor
                        else
                        {
                            var x;
                            // Player has armor already equipped
                            if(char.armor_equipped.length > 0)
                            {
                                for(x = 0; x < char.armor_equipped.length; x++)
                                {
                                    // Unequip armor
                                    if(char.armor_equipped[x].type != "shield")
                                    {
                                        message.channel.send(`${char.armor_equipped[x].name} was unequipped`);
                                        char.armor.push(char.armor_equipped[x]);
                                        char.armor_equipped.splice(x, 1);
                                    }
                                }
                            }
                            // Equip armor
                            char.armor_equipped.push(char.armor[position]);
                            char.armor.splice(position, 1);
                            return message.channel.send(`${gear_name} was equipped.`);
                        }
                    }

                    // User can't equip item because they don't have it or it doesn't exist 
                    return message.channel.send(`Could not equip ${gear_name}`);
                }

                // ******************************** UNEQUIP WEAPON/ARMOR **********************************************
                else if(action == "unequip")
                {
                    // Counter variable for number of args
                    var i = 3;

                    // See if player has shield equipped
                    var shield_equipped = false;

                    // Variables 
                    var exists = false;
                    var position;
                    
                    for(k = 0; k < char.armor_equipped.length; k++)
                    {
                        if(char.armor_equipped[k].type == "shield")
                            shield_equipped = true;
                    }

                    // User didn't supply enough arguments 
                    if(args.length < 4)
                    {
                        message.channel.send("Insufficient arguments supplied with **!dnd unequip** command.");
                        return message.channel.send("To equip armor or a weapon, use the **!dnd unequip [weapon/armor] \"[weapon/armor name]\" [offhand] <--(optional argument, must be a light weapon or shield)**");
                    }

                    // Gear variable will be equal to "weapon" or "armor" specifing what is being unequipped
                    var gear_type = args[2].toLowerCase();
                    // User didn't specify if armor or weapon is being unequipped
                    if(gear_type != "weapon" && gear_type != "armor")
                    {
                        message.channel.send("Please specify if a weapon or armor is being equipped.");
                        return message.channel.send("To equip armor or a weapon, use the **!dnd unequip [weapon/armor] \"[weapon/armor name]\" [offhand] <--(optional argument, must be a light weapon to put in offhand)**");
                    }

                    // Get name of item being unequipped
                    if(!(args[3].charAt(0) == "\""))
                        return message.channel.send("Please put the name of the armor or weapon between quotation marks. \"weapon/armor name\".");

                    var gear_name = args[3].substring(1);

                    // If name of weapon or armor is only one word or contains no spaces
                    if(gear_name.charAt(gear_name.length - 1) == "\"")
                        gear_name = gear_name.substring(0, gear_name.length - 1);
                    
                    // Name of weapon/armor has spaces
                    else
                    {
                        i = 4;

                        while(!(args[i].charAt(args[i].length - 1) == "\""))
                        {
                            gear_name = gear_name.concat(` ${args[i]}`);
                            i = i + 1;
                            if(i == args.length)
                                return message.channel.send("Please put the name of the armor or weapon between quotation marks. \"weapon/armor name\".");
                        }

                        gear_name = gear_name.concat(` ${args[i].substring(0, args[i].length - 1)}`);
                    }

                    // Set letters of item being equipped to lower case
                    gear_name = gear_name.toLowerCase();

                    // If user wants to unequip weapon in offhand
                    if((i + 1 == args.length - 1) && gear_type == "weapon")
                    {
                        if((args[i + 1] == "offhand") && char.weapons_equipped.length == 2)
                        {
                            if(gear_name == char.weapons_equipped[1].name)
                            {
                                char.weapons.push(char.weapons_equipped[1]);
                                char.weapons_equipped.pop();
                                return message.channel.send(`${gear_name} was unequipped.`);
                            }
                        }
                    }

                    // User wants to unequip weapon in mainhand
                    for(i = 0; i < char.weapons_equipped.length; i++)
                    {
                        if(gear_name == char.weapons_equipped[i].name)
                        {
                            position = i;
                            exists = true;
                        }
                    }

                    // Unequip weapon
                    if(gear_type == "weapon")
                    {
                        if(exists)
                        {
                            char.weapons.push(char.weapons_equipped[position]);
                            char.weapons_equipped.slice(position, 1);
                            return message.channel.send(`${gear_name} was unequipped.`);
                        }
                    }

                    // User wants to unequip armor
                    exists = false;
                    for(i = 0; i < char.armor_equipped.length; i++)
                    {
                        if(gear_name == char.armor_equipped[i].name)
                        {
                            position = i;
                            exists = true;
                        }
                    }

                    // Unequip armor
                    if(gear_type == "armor")
                    {
                        if(exists)
                        {
                            char.armor.push(char.armor_equipped[position]);
                            char.armor_equipped.slice(position, 1);
                            return message.channel.send(`${gear_name} was unequipped.`);
                        }
                    }

                    // User wants to unequip item that is not equipped
                    return message.channel.send(`Could not unequip ${gear_name}.`);
                }

                // ******************************** CREATE CHARACTERS **********************************************
                else if(action == "character")
                {
                    // User provided invalid number of arguments
                    if(args.length < 5)
                    {
                        message.channel.send("Invalid number of arguments provided with !dnd character command");
                        return message.channel.send("Use the **!dnd character \"[name]\" [class] [race]** command to create character.");
                    }

                    // Get player name
                    if(!(args[2].charAt(0) == "\""))
                        return message.channel.send("Please put your character name between quotation marks. \"character name\".");

                    // Get rid of first quotation mark
                    var name = args[2].substring(1);
                    
                    var i = 2;

                    // If name is only one word name or contains no spaces
                    if(name.charAt(name.length - 1) == "\"")
                        name = name.substring(0, name.length - 1);

                    // If name contains spaces
                    else
                    {
                        i = 3;
                        while(!(args[i].charAt(args[i].length - 1) == "\""))
                        {
                            name = name.concat(` ${args[i]}`);
                            i = i + 1;
                            if(i == args.length)
                                return message.channel.send("Please put your character name between quotation marks. \"character name\".");
                        }

                        name = name.concat(` ${args[i].substring(0, args[i].length - 1)}`);
                    }

                    // Get player class and race
                    const char_class = args[i + 1].toLowerCase();
                    const race = args[i + 2].toLowerCase();

                    // User entered invalid class
                    if(classes.indexOf(char_class) == -1)
                    {
                        message.channel.send("Invalid class.");
                        return message.channel.send("Use the **!dnd classes** command to see a list of playable classes.");
                    }

                    // User entered invalid race
                    if(races.indexOf(race) == -1)
                    {
                        message.channel.send("Invalid race.");
                        return message.channel.send("Use the **!dnd races** command to see a list of playable races.");
                    }

                    // Create character
                    character.user = message.author.username;
                    character.name = name;
                    character.char_class = char_class;
                    character.race = race;

                    // Add character to array of characters
                    server[message.guild.id].characters.push(character);

                    // Add player to array of players
                    server[message.guild.id].players.push(message.author.username);

                    // Get player character
                    const char = server[message.guild.id].characters[server[message.guild.id].players.length - 1];

                    // Let player pick skills
                    message.channel.send("Character created!");
                    
                    // Add Barbarian saving throws, proficiencies and starting items
                    // Then prompt user to choose skills
                    if(char_class == "barbarian")
                    {
                        /*
                            Devin added code here
                        */

                        // Add saving throws
                        char.saving_throws.push("strength", "constitution");

                        // Add proficiencies
                        char.armor_proficiencies.push("light", "medium", "shield");
                        char.weapon_proficiencies.push("simple", "martial");

                        // Add starting items
                        // Greataxe
                        greataxe =
                        {
                            // Weapon attributes
                            name: "greataxe",
                            hand: "2h",
                            damage: "1d12",
                            damage_type: "slashing",
                            weapon_type: "martial",
                            thrown: false,
                            finesse: false,
                            light: false
                        };
                        char.weapons_equipped.push(greataxe);
                        // 2 handaxes
                        handaxe1 =
                        {
                            // Weapon attributes
                            name: "handaxe",
                            hand: "1h",
                            damage: "1d6",
                            damage_type: "slashing",
                            weapon_type: "simple",
                            thrown: true,
                            finesse: false,
                            light: true
                        };
                        char.weapons.push(handaxe1);
                        handaxe2 =
                        {
                            // Weapon attributes
                            name: "handaxe",
                            hand: "1h",
                            damage: "1d6",
                            damage_type: "slashing",
                            weapon_type: "simple",
                            thrown: true,
                            finesse: false,
                            light: true
                        };
                        char.weapons.push(handaxe2);
                        // 4 javelins
                        javelin1 =
                        {
                            // Weapon attributes
                            name: "javelin",
                            hand: "1h",
                            damage: "1d6",
                            damage_type: "piercing",
                            weapon_type: "simple",
                            thrown: true,
                            finesse: false,
                            light: false
                        };
                        char.weapons.push(javelin1);
                        javelin2 =
                        {
                            // Weapon attributes
                            name: "javelin",
                            hand: "1h",
                            damage: "1d6",
                            damage_type: "piercing",
                            weapon_type: "simple",
                            thrown: true,
                            finesse: false,
                            light: false
                        };
                        char.weapons.push(javelin2);
                        javelin3 =
                        {
                            // Weapon attributes
                            name: "javelin",
                            hand: "1h",
                            damage: "1d6",
                            damage_type: "piercing",
                            weapon_type: "simple",
                            thrown: true,
                            finesse: false,
                            light: false
                        };
                        char.weapons.push(javelin3);
                        javelin4 =
                        {
                            // Weapon attributes
                            name: "javelin",
                            hand: "1h",
                            damage: "1d6",
                            damage_type: "piercing",
                            weapon_type: "simple",
                            thrown: true,
                            finesse: false,
                            light: false
                        };
                        char.weapons.push(javelin4);
                        // backpack
                        backpack =
                        {
                            // Item attributes
                            name: "backpack",
                            amount: 1
                        };
                        char.items.push(backpack);
                        // bedroll
                        bedroll =
                        {
                            // Item attributes
                            name: "bedroll",
                            amount: 1
                        };
                        char.items.push(bedroll);
                        // mess kit
                        mess_kit =
                        {
                            // Item attributes
                            name: "mess kit",
                            amount: 1
                        };
                        char.items.push(mess_kit);
                        // tinderbox
                        tinderbox =
                        {
                            // Item attributes
                            name: "tinderbox",
                            amount: 1
                        };
                        char.items.push(tinderbox);
                        // 10 torches
                        torch =
                        {
                            // Item attributes
                            name: "torch",
                            amount: 10
                        };
                        char.items.push(torch);
                        // 10 days of rations
                        ration =
                        {
                            // Item attributes
                            name: "ration",
                            amount: 10
                        };
                        char.items.push(ration);
                        // waterskin
                        waterskin =
                        {
                            // Item attributes
                            name: "waterskin",
                            amount: 1
                        };
                        char.items.push(waterskin);
                        // 50 feet of hempen rope
                        hempen_rope =
                        {
                            // Item attributes
                            name: "hempen rope",
                            amount: 50
                        };
                        char.items.push(hempen_rope);

                        // Prompt user to set skills
                        message.channel.send("Please choose 2 of the following skills: **Animal Handling**, **Athletics**, **Intimidation**, **Nature**, **Perception**, **Survival**.");
                        return message.channel.send("You can choose skills by using the **!dnd skills [skill 1] [skill 2]** command.");
                    }

                    // Add Bard saving throws, proficiencies and starting items
                    // Then prompt user to choose skills
                    else if(char_class == "bard")
                    {
                        // Add saving throws
                        char.saving_throws.push("dexterity", "charisma");

                        // Add proficiencies
                        char.weapon_proficiencies.push("simple", "hand crossbow", "longsword", "rapier", "shortsword");
                        char.armor_proficiencies.push("light");

                        // Add starting items
                        // Rapier
                        rapier =
                        {
                            // Weapon attributes
                            name: "rapier",
                            hand: "1h",
                            damage: "1d8",
                            damage_type: "piercing",
                            weapon_type: "martial",
                            thrown: false,
                            finesse: true,
                            light: false
                        };
                        char.weapons_equipped.push(rapier);
                        // Dagger
                        dagger =
                        {
                            // Weapon attributes
                            name: "dagger",
                            hand: "1h",
                            damage: "1d4",
                            damage_type: "piercing",
                            weapon_type: "simple",
                            thrown: true,
                            finesse: true,
                            light: true
                        };
                        char.weapons.push(dagger);
                        // Leather armor
                        leather_armor =
                        {
                            // Weapon attributes
                            name: "leather armor",
                            type: "light",
                            ac: 11
                        };
                        char.armor_equipped.push(leather_armor);
                        // lute
                        lute =
                        {
                            // Weapon attributes
                            name: "lute",
                            type: "musical instrument",
                            amount: 1
                        };
                        char.tools.push(lute);
                        // backpack
                        backpack =
                        {
                            // Item attributes
                            name: "backpack",
                            amount: 1
                        };
                        char.items.push(backpack);
                        // bedroll
                        bedroll =
                        {
                            // Item attributes
                            name: "bedroll",
                            amount: 1
                        };
                        char.items.push(bedroll);
                        // costume
                        costume =
                        {
                            // Item attributes
                            name: "costume",
                            amount: 2
                        };
                        char.items.push(costume);
                        // 5 candles
                        candle =
                        {
                            // Item attributes
                            name: "candle",
                            amount: 5
                        };
                        char.items.push(candle);
                        // 5 days of rations
                        ration =
                        {
                            // Item attributes
                            name: "ration",
                            amount: 5
                        };
                        char.items.push(ration);
                        // waterskin
                        waterskin =
                        {
                            // Item attributes
                            name: "waterskin",
                            amount: 1
                        };
                        char.items.push(waterskin);
                        // disguise kit
                        disguise_kit =
                        {
                            // Item attributes
                            name: "disguise kit",
                            amount: 1
                        };
                        char.items.push(disguise_kit);

                        // Prompt user to set skills
                        message.channel.send("Please choose any 3 skills.");
                        return message.channel.send("You can choose skills by using the **!dnd skills [skill 1] [skill 2] [skill 3]** command.");
                    }

                    // Add Cleric saving throws, proficiencies and starting items
                    // Then prompt user to choose skills
                    else if(char_class == "cleric")
                    {
                        // Saving throws
                        char.saving_throws.push("wisdom", "charisma");

                        // Proficiencies
                        char.armor_proficiencies.push("light", "medium", "shield");
                        char.weapon_proficiencies.push("simple");

                        // Starting items
                        // Mace
                        mace =
                        {
                            // Weapon attributes
                            name: "mace",
                            hand: "1h",
                            damage: "1d6",
                            damage_type: "bludgeoning",
                            weapon_type: "simple",
                            thrown: false,
                            finesse: false,
                            light: false
                        };
                        char.weapons_equipped.push(mace);
                        // Scale mail
                        scale_mail = 
                        {
                            // Armor attributes
                            name: "scale mail",
                            type: "medium",
                            ac: 14
                        };
                        char.armor_equipped.push(scale_mail);
                        // Light crossbow
                        light_crossbow = 
                        {
                            name: "light crossbow",
                            hand: "2h",
                            damage: "1d8",
                            damage_type: "piercing",
                            weapon_type: "simple",
                            thrown: false,
                            finesse: false,
                            light: false
                        };
                        char.weapons.push(light_crossbow);
                        // Shield
                        shield = 
                        {
                            // Armor attribtues
                            shield: "shield",
                            type: "shield",
                            ac: 2
                        };
                        char.armor_equipped.push(shield);
                        // 20 Crossbow bolts
                        bolt =
                        {
                            // Item attributes
                            name: "bolt",
                            amount: 20
                        };
                        char.items.push(bolt);
                        // Backpack
                        backpack =
                        {
                            // Item attributes
                            name: "backpack",
                            amount: 1
                        };
                        char.items.push(backpack);
                        // Blanket
                        blanket =
                        {
                            // Item attributes
                            name: "blanket",
                            amount: 1
                        };
                        char.items.push(blanket);
                        // 10 Candles
                        candle =
                        {
                            // Item attributes
                            name: "candle",
                            amount: 10
                        };
                        char.items.push(candle);
                        // tinderbox
                        tinderbox =
                        {
                            // Item attributes
                            name: "tinderbox",
                            amount: 1
                        };
                        char.items.push(tinderbox);
                        // Alms box
                        alms_box =
                        {
                            // Item attributes
                            name: "alms box",
                            amount: 1
                        };
                        char.items.push(alms_box);
                        // Incense
                        incense =
                        {
                            // Item attributes
                            name: "incense",
                            amount: 2
                        };
                        char.items.push(incense);
                        // Censer
                        censer =
                        {
                            // Item attributes
                            name: "censer",
                            amount: 1
                        };
                        char.items.push(censer);
                        // Vestments
                        vestments =
                        {
                            // Item attributes
                            name: "vestments",
                            amount: 1
                        };
                        char.items.push(vestments);
                        // Rations
                        ration =
                        {
                            // Item attributes
                            name: "ration",
                            amount: 2
                        };
                        char.items.push(ration);
                        // Waterskin
                        waterskin =
                        {
                            // Item attributes
                            name: "waterskin",
                            amount: 1
                        };
                        char.items.push(waterskin);

                        // Prompt user to set skills
                        message.channel.send("Please choose 2 of the following skills: **History**, **Insight**, **Medicine**, **Persuasion**, **Religion**.");
                        return message.channel.send("You can choose skills by using the **!dnd skills [skill 1] [skill 2]** command.");
                    }

                    // Add Druid saving throws, proficiencies and starting items
                    // Then prompt user to choose skills
                    else if(char_class == "druid")
                    {
                        // Saving throws
                        char.saving_throws.push("intelligence", "wisdom");
                        // Armor proficiencies
                        char.armor_proficiencies.push("light", "medium", "shield");
                        // Weapon proficiencies
                        char.weapon_proficiencies.push("club", "dagger", "dart", "javelin", "mace", "quarterstaff", "scimitar", "sickle", "sling", "spear");

                        // Scimitar
                        scimitar =
                        {
                            name: "scimitar",
                            hand: "1h",
                            damage: "1d6",
                            damage_type: "slashing",
                            weapon_type: "martial",
                            thrown: false,
                            finesse: true,
                            light: true
                        };
                        char.weapons_equipped.push(scimitar);
                        // Leather armor
                        leather_armor =
                        {
                            // Weapon attributes
                            name: "leather armor",
                            type: "light",
                            ac: 11
                        };
                        char.armor_equipped.push(leather_armor);
                        // Shield
                        shield = 
                        {
                            // Armor attribtues
                            shield: "shield",
                            type: "shield",
                            ac: 2
                        };
                        char.armor_equipped.push(shield);
                        // Herbalism kit
                        herbalism_kit =
                        {
                            name: "herbalism kit",
                            type: "herbalism kit",
                            amount: 1
                        }
                        char.tools.push(herbalism_kit);
                        // backpack
                        backpack =
                        {
                            // Item attributes
                            name: "backpack",
                            amount: 1
                        };
                        char.items.push(backpack);
                        // bedroll
                        bedroll =
                        {
                            // Item attributes
                            name: "bedroll",
                            amount: 1
                        };
                        char.items.push(bedroll);
                        // mess kit
                        mess_kit =
                        {
                            // Item attributes
                            name: "mess kit",
                            amount: 1
                        };
                        char.items.push(mess_kit);
                        // tinderbox
                        tinderbox =
                        {
                            // Item attributes
                            name: "tinderbox",
                            amount: 1
                        };
                        char.items.push(tinderbox);
                        // 10 torches
                        torch =
                        {
                            // Item attributes
                            name: "torch",
                            amount: 10
                        };
                        char.items.push(torch);
                        // 10 days of rations
                        ration =
                        {
                            // Item attributes
                            name: "ration",
                            amount: 10
                        };
                        char.items.push(ration);
                        // waterskin
                        waterskin =
                        {
                            // Item attributes
                            name: "waterskin",
                            amount: 1
                        };
                        char.items.push(waterskin);
                        // 50 feet of hempen rope
                        hempen_rope =
                        {
                            // Item attributes
                            name: "hempen rope",
                            amount: 50
                        };
                        char.items.push(hempen_rope);

                        // Prompt user to set skills
                        message.channel.send("Please choose 2 of the following skills: **Arcana**, **Animal Handling**, **Insight**, **Medicine**, **Nature**, **Perception**, **Religion**, **Survival**.");
                        return message.channel.send("You can choose skills by using the **!dnd skills [skill 1] [skill 2]** command.");
                    }

                    // Add Fighter saving throws, proficiencies and starting items
                    // Then prompt user to choose skills
                    else if(char_class == "fighter")
                    {
                        // Saving throws
                        char.saving_throws.push("strength", "constitution");
                        // Armor proficiencies
                        char.armor_proficiencies.push("light", "medium", "heavy", "shield");
                        // Weapon proficiencies
                        char.weapon_proficiencies.push("simple", "martial");

                        // Starting items
                        // Longsword
                        longsword = 
                        {
                            // Weapon attributes
                            name: "longsword",
                            hand: "v",
                            damage: "1d8",
                            damage_type: "slashing",
                            weapon_type: "martial",
                            thrown: false,
                            finesse: false,
                            light: false
                        };
                        char.weapons_equipped.push(longsword);
                        // Chain mail
                        chain_mail =
                        {
                            // Armor attributes
                            name: "chain mail",
                            type: "heavy",
                            ac: 16
                        };
                        char.armor_equipped.push(chain_mail);
                        // Shield
                        shield = 
                        {
                            // Armor attribtues
                            shield: "shield",
                            type: "shield",
                            ac: 2
                        };
                        char.armor_equipped.push(shield);
                        // Light crossbow
                        light_crossbow = 
                        {
                            name: "light crossbow",
                            hand: "2h",
                            damage: "1d8",
                            damage_type: "piercing",
                            weapon_type: "simple",
                            thrown: false,
                            finesse: false,
                            light: false
                        };
                        char.weapons.push(light_crossbow);
                        // 20 bolts
                        bolt = 
                        {
                            name: "bolt",
                            amount: 20
                        };
                        char.items.push(bolt);
                        // Backpack
                        backpack = 
                        {
                            name: "backpack",
                            amount: 1
                        };
                        char.items.push(backpack);
                        // Crowbar
                        crowbar = 
                        {
                            name: "crowbar",
                            amount: 1
                        };
                        char.items.push(crowbar);
                        // Hammer
                        hammer = 
                        {
                            name: "hammer",
                            amount: 1
                        };
                        char.items.push(hammer);
                        // 10 pitons
                        piton =
                        {
                            name: "piton",
                            amount: 10
                        };
                        char.items.push(piton);
                        // tinderbox
                        tinderbox =
                        {
                            // Item attributes
                            name: "tinderbox",
                            amount: 1
                        };
                        char.items.push(tinderbox);
                        // 10 torches
                        torch =
                        {
                            // Item attributes
                            name: "torch",
                            amount: 10
                        };
                        char.items.push(torch);
                        // 10 days of rations
                        ration =
                        {
                            // Item attributes
                            name: "ration",
                            amount: 10
                        };
                        char.items.push(ration);
                        // waterskin
                        waterskin =
                        {
                            // Item attributes
                            name: "waterskin",
                            amount: 1
                        };
                        char.items.push(waterskin);
                        // 50 feet of hempen rope
                        hempen_rope =
                        {
                            // Item attributes
                            name: "hempen rope",
                            amount: 50
                        };
                        char.items.push(hempen_rope);

                        // Prompt user to set skills
                        message.channel.send("Please choose 2 of the following skills: **Acrobatics**, **Animal Handling**, **Athletics**, **History**, **Insight**, **Intimidation**, **Perception**, **Survival**.");
                        return message.channel.send("You can choose skills by using the **!dnd skills [skill 1] [skill 2]** command.");
                    }

                    // Add Monk saving throws, proficiencies and starting items
                    // Then prompt user to choose skills
                    else if(char_class == "monk")
                    {
                        // Saving throws
                        char.saving_throws.push("strength", "dexterity");
                        // Weapon proficiencies (monks have no armor proficiencies)
                        char.weapon_proficiencies.push("simple", "shortsword");

                        // Starting items
                        // Shortsword
                        shortsword =
                        {
                            name: "shortsword",
                            hand: "1h",
                            damage: "1d6",
                            damage_type: "piercing",
                            weapon_type: "martial",
                            thrown: false,
                            finesse: true,
                            light: true
                        };
                        char.weapons.push(shortsword);
                        // 10 darts
                        dart1 = 
                        {
                            name: "dart",
                            hand: "1h",
                            damage: "1d4",
                            damage_type: "piercing",
                            weapon_type: "simple",
                            thrown: true,
                            finesse: true,
                            light: false
                        };
                        char.weapons.push(dart1);
                        dart2 = 
                        {
                            name: "dart",
                            hand: "1h",
                            damage: "1d4",
                            damage_type: "piercing",
                            weapon_type: "simple",
                            thrown: true,
                            finesse: true,
                            light: false
                        };
                        char.weapons.push(dart2);
                        dart3 = 
                        {
                            name: "dart",
                            hand: "1h",
                            damage: "1d4",
                            damage_type: "piercing",
                            weapon_type: "simple",
                            thrown: true,
                            finesse: true,
                            light: false
                        };
                        char.weapons.push(dart3);
                        dart4 = 
                        {
                            name: "dart",
                            hand: "1h",
                            damage: "1d4",
                            damage_type: "piercing",
                            weapon_type: "simple",
                            thrown: true,
                            finesse: true,
                            light: false
                        };
                        char.weapons.push(dart4);
                        dart5 = 
                        {
                            name: "dart",
                            hand: "1h",
                            damage: "1d4",
                            damage_type: "piercing",
                            weapon_type: "simple",
                            thrown: true,
                            finesse: true,
                            light: false
                        };
                        char.weapons.push(dart5);
                        dart6 = 
                        {
                            name: "dart",
                            hand: "1h",
                            damage: "1d4",
                            damage_type: "piercing",
                            weapon_type: "simple",
                            thrown: true,
                            finesse: true,
                            light: false
                        };
                        char.weapons.push(dart6);
                        dart7 = 
                        {
                            name: "dart",
                            hand: "1h",
                            damage: "1d4",
                            damage_type: "piercing",
                            weapon_type: "simple",
                            thrown: true,
                            finesse: true,
                            light: false
                        };
                        char.weapons.push(dart7);
                        dart8 = 
                        {
                            name: "dart",
                            hand: "1h",
                            damage: "1d4",
                            damage_type: "piercing",
                            weapon_type: "simple",
                            thrown: true,
                            finesse: true,
                            light: false
                        };
                        char.weapons.push(dart8);
                        dart9 = 
                        {
                            name: "dart",
                            hand: "1h",
                            damage: "1d4",
                            damage_type: "piercing",
                            weapon_type: "simple",
                            thrown: true,
                            finesse: true,
                            light: false
                        };
                        char.weapons.push(dart9);
                        dart10 = 
                        {
                            name: "dart",
                            hand: "1h",
                            damage: "1d4",
                            damage_type: "piercing",
                            weapon_type: "simple",
                            thrown: true,
                            finesse: true,
                            light: false
                        };
                        char.weapons.push(dart10);
                        // Backpack
                        backpack = 
                        {
                            name: "backpack",
                            amount: 1
                        };
                        char.items.push(backpack);
                        // Crowbar
                        crowbar = 
                        {
                            name: "crowbar",
                            amount: 1
                        };
                        char.items.push(crowbar);
                        // Hammer
                        hammer = 
                        {
                            name: "hammer",
                            amount: 1
                        };
                        char.items.push(hammer);
                        // 10 pitons
                        piton =
                        {
                            name: "piton",
                            amount: 10
                        };
                        char.items.push(piton);
                        // tinderbox
                        tinderbox =
                        {
                            // Item attributes
                            name: "tinderbox",
                            amount: 1
                        };
                        char.items.push(tinderbox);
                        // 10 torches
                        torch =
                        {
                            // Item attributes
                            name: "torch",
                            amount: 10
                        };
                        char.items.push(torch);
                        // 10 days of rations
                        ration =
                        {
                            // Item attributes
                            name: "ration",
                            amount: 10
                        };
                        char.items.push(ration);
                        // waterskin
                        waterskin =
                        {
                            // Item attributes
                            name: "waterskin",
                            amount: 1
                        };
                        char.items.push(waterskin);
                        // 50 feet of hempen rope
                        hempen_rope =
                        {
                            // Item attributes
                            name: "hempen rope",
                            amount: 50
                        };
                        char.items.push(hempen_rope);

                        // Prompt user for skills
                        message.channel.send("Please choose 2 of the following skills: **Acrobatics**, **Athletics**, **History**, **Insight**, **Religion**, **Stealth**.");
                        return message.channel.send("You can choose skills by using the **!dnd skills [skill 1] [skill 2]** command.");
                    }

                    // Add Paladin saving throws, proficiencies and starting items
                    // Then prompt user to choose skills
                    else if(char_class == "paladin")
                    {
                        // Saving throws
                        char.saving_throws.push("wisdom", "charisma");
                        // Armor proficiencies
                        char.armor_proficiencies.push("light", "medium", "heavy", "shield");
                        // Weapon proficiencies
                        char.weapon_proficiencies.push("simple", "martial");

                        // Starting items
                         // Longsword
                         longsword = 
                         {
                             // Weapon attributes
                             name: "longsword",
                             hand: "v",
                             damage: "1d8",
                             damage_type: "slashing",
                             weapon_type: "martial",
                             thrown: false,
                             finesse: false,
                             light: false
                         };
                         char.weapons_equipped.push(longsword);
                         // Chain mail
                         chain_mail =
                         {
                             // Armor attributes
                             name: "chain mail",
                             type: "heavy",
                             ac: 16
                         };
                         char.armor_equipped.push(chain_mail);
                         // Shield
                         shield = 
                         {
                             // Armor attribtues
                             shield: "shield",
                             type: "shield",
                             ac: 2
                         };
                         char.armor_equipped.push(shield);
                         // 5 javelins
                         javelin1 =
                        {
                            // Weapon attributes
                            name: "javelin",
                            hand: "1h",
                            damage: "1d6",
                            damage_type: "piercing",
                            weapon_type: "simple",
                            thrown: true,
                            finesse: false,
                            light: false
                        };
                        char.weapons.push(javelin1);
                        javelin2 =
                        {
                            // Weapon attributes
                            name: "javelin",
                            hand: "1h",
                            damage: "1d6",
                            damage_type: "piercing",
                            weapon_type: "simple",
                            thrown: true,
                            finesse: false,
                            light: false
                        };
                        char.weapons.push(javelin2);
                        javelin3 =
                        {
                            // Weapon attributes
                            name: "javelin",
                            hand: "1h",
                            damage: "1d6",
                            damage_type: "piercing",
                            weapon_type: "simple",
                            thrown: true,
                            finesse: false,
                            light: false
                        };
                        char.weapons.push(javelin3);
                        javelin4 =
                        {
                            // Weapon attributes
                            name: "javelin",
                            hand: "1h",
                            damage: "1d6",
                            damage_type: "piercing",
                            weapon_type: "simple",
                            thrown: true,
                            finesse: false,
                            light: false
                        };
                        char.weapons.push(javelin4);
                        javelin5 =
                        {
                            // Weapon attributes
                            name: "javelin",
                            hand: "1h",
                            damage: "1d6",
                            damage_type: "piercing",
                            weapon_type: "simple",
                            thrown: true,
                            finesse: false,
                            light: false
                        };
                        char.weapons.push(javelin5);
                        // 20 Crossbow bolts
                        bolt =
                        {
                            // Item attributes
                            name: "bolt",
                            amount: 20
                        };
                        char.items.push(bolt);
                        // Backpack
                        backpack =
                        {
                            // Item attributes
                            name: "backpack",
                            amount: 1
                        };
                        char.items.push(backpack);
                        // Blanket
                        blanket =
                        {
                            // Item attributes
                            name: "blanket",
                            amount: 1
                        };
                        char.items.push(blanket);
                        // 10 Candles
                        candle =
                        {
                            // Item attributes
                            name: "candle",
                            amount: 10
                        };
                        char.items.push(candle);
                        // tinderbox
                        tinderbox =
                        {
                            // Item attributes
                            name: "tinderbox",
                            amount: 1
                        };
                        char.items.push(tinderbox);
                        // Alms box
                        alms_box =
                        {
                            // Item attributes
                            name: "alms box",
                            amount: 1
                        };
                        char.items.push(alms_box);
                        // Incense
                        incense =
                        {
                            // Item attributes
                            name: "incense",
                            amount: 2
                        };
                        char.items.push(incense);
                        // Censer
                        censer =
                        {
                            // Item attributes
                            name: "censer",
                            amount: 1
                        };
                        char.items.push(censer);
                        // Vestments
                        vestments =
                        {
                            // Item attributes
                            name: "vestments",
                            amount: 1
                        };
                        char.items.push(vestments);
                        // Rations
                        ration =
                        {
                            // Item attributes
                            name: "ration",
                            amount: 2
                        };
                        char.items.push(ration);
                        // Waterskin
                        waterskin =
                        {
                            // Item attributes
                            name: "waterskin",
                            amount: 1
                        };
                        char.items.push(waterskin);

                        // Prompt user to set skills
                        message.channel.send("Please choose 2 of the following skills: **Athletics**, **Insight**, **Intimidation**, **Medicine**, **Persuasion**, **Religion**.");
                        return message.channel.send("You can choose skills by using the **!dnd skills [skill 1] [skill 2]** command.");
                    }

                    // Add Ranger saving throws, proficiencies and starting items
                    // Then prompt user to choose skills
                    else if(char_class == "ranger")
                    {
                        // Saving throws
                        char.saving_throws.push("strength", "dexterity");
                        // Armor proficiencies
                        char.armor_proficiencies.push("light", "medium", "shield");
                        // Weapon proficiencies
                        char.weapon_proficiencies.push("simple", "martial");

                        // Starting items
                        // Longbow
                        longbow = 
                        {
                            name: "longbow",
                            hand: "2h",
                            damage: "1d8",
                            damage_type: "piercing",
                            weapon_type: "martial",
                            thrown: false,
                            finesse: false,
                            light: false
                        };
                        char.weapons_equipped.push(longbow);
                        // 2 shortswords
                        shortsword1 =
                        {
                            // Weapon attributes
                            name: "shortsword",
                            hand: "1h",
                            damage: "1d6",
                            damage_type: "piercing",
                            weapon_type: "martial",
                            thrown: false,
                            finesse: true,
                            light: true
                        };
                        char.weapons.push(shortsword1);
                        shortsword2 =
                        {
                            // Weapon attributes
                            name: "shortsword",
                            hand: "1h",
                            damage: "1d6",
                            damage_type: "piercing",
                            weapon_type: "martial",
                            thrown: false,
                            finesse: true,
                            light: true
                        };
                        char.weapons.push(shortsword2);
                        // 20 arrows
                        arrow =
                        {
                            name: "arrow",
                            amount: 20
                        };
                        char.items.push(arrow);
                        // Backpack
                        backpack = 
                        {
                            name: "backpack",
                            amount: 1
                        };
                        char.items.push(backpack);
                        // Crowbar
                        crowbar = 
                        {
                            name: "crowbar",
                            amount: 1
                        };
                        char.items.push(crowbar);
                        // Hammer
                        hammer = 
                        {
                            name: "hammer",
                            amount: 1
                        };
                        char.items.push(hammer);
                        // 10 pitons
                        piton =
                        {
                            name: "piton",
                            amount: 10
                        };
                        char.items.push(piton);
                        // tinderbox
                        tinderbox =
                        {
                            // Item attributes
                            name: "tinderbox",
                            amount: 1
                        };
                        char.items.push(tinderbox);
                        // 10 torches
                        torch =
                        {
                            // Item attributes
                            name: "torch",
                            amount: 10
                        };
                        char.items.push(torch);
                        // 10 days of rations
                        ration =
                        {
                            // Item attributes
                            name: "ration",
                            amount: 10
                        };
                        char.items.push(ration);
                        // waterskin
                        waterskin =
                        {
                            // Item attributes
                            name: "waterskin",
                            amount: 1
                        };
                        char.items.push(waterskin);
                        // 50 feet of hempen rope
                        hempen_rope =
                        {
                            // Item attributes
                            name: "hempen rope",
                            amount: 50
                        };
                        char.items.push(hempen_rope);

                        // Prompt user to set skills
                        message.channel.send("Please choose 3 of the following skills: **Animal Handling**, **Athletics**, **Insight**, **Investigation**, **Nature**, **Perception**, **Stealth**, **Survival**");
                        return message.channel.send("You can choose skills by using the **!dnd skills [skill 1] [skill 2] [skill 3]** command.");
                    }

                    // Add Rogue saving throws, proficiencies and starting items
                    // Then prompt user to choose skills
                    else if(char_class == "rogue")
                    {
                        // Saving throws
                        char.saving_throws.push("dexterity", "intelligence");
                        // Armor proficiencies
                        char.armor_proficiencies.push("light");
                        // Weapon proficiencies
                        char.weapon_proficiencies.push("simple", "longsword", "rapier", "shortsword", "hand crossbow");

                        // Starting items
                        rapier = 
                        {
                            // Weapon attributes
                            name: "rapier",
                            hand: "1h",
                            damage: "1d8",
                            damage_type: "piercing",
                            weapon_type: "martial",
                            thrown: false,
                            finesse: true,
                            light: false
                        };
                        char.weapons.push(rapier);
                        // 2 daggers
                        dagger1 =
                        {
                            // Weapon attributes
                            name: "dagger",
                            hand: "1h",
                            damage: "1d4",
                            damage_type: "piercing",
                            weapon_type: "simple",
                            thrown: true,
                            finesse: true,
                            light: true
                        };
                        char.weapons_equipped.push(dagger1);
                        dagger2 =
                        {
                            // Weapon attributes
                            name: "dagger",
                            hand: "1h",
                            damage: "1d4",
                            damage_type: "piercing",
                            weapon_type: "simple",
                            thrown: true,
                            finesse: true,
                            light: true
                        };
                        char.weapons_equipped.push(dagger2);
                        // Shortbow
                        shortbow = 
                        {
                            name: "shortbow",
                            hand: "2h",
                            damage: "1d6",
                            damage_type: "piercing",
                            weapon_type: "simple",
                            thrown: false,
                            finesse: false,
                            thrown: false
                        };
                        char.weapons.push(shortbow);
                        // Leather armor
                        leather_armor =
                        {
                            name: "leather armor",
                            type: "light",
                            ac: 11
                        };
                        char.armor_equipped.push(leather_armor);
                        // Thieves' tools
                        theif_tools =
                        {
                            name: "theif tools",
                            type: "theif tools",
                            amount: 1
                        };
                        char.tools.push(theif_tools);
                        // 20 arrows
                        arrow =
                        {
                            name: "arrow",
                            amount: 20
                        };
                        // Backpack
                        backpack =
                        {
                            name: "backpack",
                            amount: 1
                        };
                        char.items.push(backpack);
                        // Backpack
                        ball_bearing =
                        {
                            name: "ball bearing",
                            amount: 1000
                        };
                        char.items.push(ball_bearing);
                        // string
                        ball_of_string =
                        {
                            name: "string",
                            amount: 10
                        };
                        char.items.push(ball_of_string);
                        // Bell
                        bell =
                        {
                            name: "bell",
                            amount: 1
                        };
                        char.items.push(bell);
                        // 5 Candles
                        candle =
                        {
                            // Item attributes
                            name: "candle",
                            amount: 5
                        };
                        char.items.push(candle);
                        // Crowbar
                        crowbar = 
                        {
                            name: "crowbar",
                            amount: 1
                        };
                        char.items.push(crowbar);
                        // Hammer
                        hammer = 
                        {
                            name: "hammer",
                            amount: 1
                        };
                        char.items.push(hammer);
                        // 10 pitons
                        piton =
                        {
                            name: "piton",
                            amount: 10
                        };
                        char.items.push(piton);
                        // Hooded lantern
                        hooded_lantern =
                        {
                            name: "hooded lantern",
                            amount: 1
                        };
                        char.items.push(hooded_lantern);
                        // 2 flasks of oil
                        flask_of_oil =
                        {
                            name: "flask of oil",
                            amount: 2
                        };
                        char.items.push(flask_of_oil);
                        // 5 days of rations
                        ration =
                        {
                            // Item attributes
                            name: "ration",
                            amount: 5
                        };
                        char.items.push(ration)
                        // tinderbox
                        tinderbox =
                        {
                            // Item attributes
                            name: "tinderbox",
                            amount: 1
                        };
                        char.items.push(tinderbox);
                        // waterskin
                         waterskin =
                         {
                             // Item attributes
                             name: "waterskin",
                             amount: 1
                         };
                         char.items.push(waterskin);
                         // 50 feet of hempen rope
                         hempen_rope =
                         {
                             // Item attributes
                             name: "hempen rope",
                             amount: 50
                         };
                         char.items.push(hempen_rope);

                        // Prompt user to set skills
                        message.channel.send("Please choose 4 of the following skills: **Acrobatics**, **Athletics**, **Deception**, **Insight**, **Intimidation**, **Investigation**, **Perception**, **Performance**, **Persuasion**, **Sleight of Hand**, **Stealth**.");
                        return message.channel.send("You can choose skills by using the **!dnd skills [skill 1] [skill 2] [skill 3] [skill 4]** command.");
                    }

                    // Add Sorcerer saving throws, proficiencies and starting items
                    // Then prompt user to choose skills
                    else if(char_class == "sorcerer")
                    {
                        // Saving throws
                        char.saving_throws.push("constitution", "charisma");
                        // Weapon proficiencies
                        char.weapon_proficiencies.push("dagger", "dart", "sling", "quarterstaff", "light crossbow");
                        
                        // Starting items
                        // Light crossbow
                        light_crossbow = 
                        {
                            name: "light crossbow",
                            hand: "2h",
                            damage: "1d8",
                            damage_type: "piercing",
                            weapon_type: "simple",
                            thrown: false,
                            finesse: false,
                            light: false
                        };
                        char.weapons_equipped.push(light_crossbow);
                        // 2 daggers
                        dagger1 =
                        {
                            // Weapon attributes
                            name: "dagger",
                            hand: "1h",
                            damage: "1d4",
                            damage_type: "piercing",
                            weapon_type: "simple",
                            thrown: true,
                            finesse: true,
                            light: true
                        };
                        char.weapons.push(dagger1);
                        dagger2 =
                        {
                            // Weapon attributes
                            name: "dagger",
                            hand: "1h",
                            damage: "1d4",
                            damage_type: "piercing",
                            weapon_type: "simple",
                            thrown: true,
                            finesse: true,
                            light: true
                        };
                        char.weapons.push(dagger2);
                        // 20 bolts
                        bolt =
                        {
                            name: "bolt",
                            amount: 20
                        };
                        char.items.push(bolt);
                        // Backpack
                        backpack = 
                        {
                            name: "backpack",
                            amount: 1
                        };
                        char.items.push(backpack);
                        // Crowbar
                        crowbar = 
                        {
                            name: "crowbar",
                            amount: 1
                        };
                        char.items.push(crowbar);
                        // Hammer
                        hammer = 
                        {
                            name: "hammer",
                            amount: 1
                        };
                        char.items.push(hammer);
                        // 10 pitons
                        piton =
                        {
                            name: "piton",
                            amount: 10
                        };
                        char.items.push(piton);
                        // tinderbox
                        tinderbox =
                        {
                            // Item attributes
                            name: "tinderbox",
                            amount: 1
                        };
                        char.items.push(tinderbox);
                        // 10 torches
                        torch =
                        {
                            // Item attributes
                            name: "torch",
                            amount: 10
                        };
                        char.items.push(torch);
                        // 10 days of rations
                        ration =
                        {
                            // Item attributes
                            name: "ration",
                            amount: 10
                        };
                        char.items.push(ration);
                        // waterskin
                        waterskin =
                        {
                            // Item attributes
                            name: "waterskin",
                            amount: 1
                        };
                        char.items.push(waterskin);
                        // 50 feet of hempen rope
                        hempen_rope =
                        {
                            // Item attributes
                            name: "hempen rope",
                            amount: 50
                        };
                        char.items.push(hempen_rope);

                        // Prompt user to set skills
                        message.channel.send("Please choose 2 of the following skills: **Arcana**, **Deception**, **Insight**, **Intimidation**, **Persuasion**, **Religion**.");
                        return message.channel.send("You can choose skills by using the **!dnd skills [skill 1] [skill 2]** command.");
                    }

                    // Add Warlock saving throws, proficiencies and starting items
                    // Then prompt user to choose skills
                    else if(char_class == "warlock")
                    {
                        // Saving throws
                        char.saving_throws.push("wisdom", "charisma");
                        // Armor proficiencies
                        char.armor_proficiencies.push("light");
                        // Weapon proficiencies
                        char.weapon_proficiencies.push("simple");

                        // Light crossbow
                        light_crossbow = 
                        {
                            name: "light crossbow",
                            hand: "2h",
                            damage: "1d8",
                            damage_type: "piercing",
                            weapon_type: "simple",
                            thrown: false,
                            finesse: false,
                            light: false
                        };
                        char.weapons_equipped.push(light_crossbow);
                        // 2 daggers
                        dagger1 =
                        {
                            // Weapon attributes
                            name: "dagger",
                            hand: "1h",
                            damage: "1d4",
                            damage_type: "piercing",
                            weapon_type: "simple",
                            thrown: true,
                            finesse: true,
                            light: true
                        };
                        char.weapons.push(dagger1);
                        dagger2 =
                        {
                            // Weapon attributes
                            name: "dagger",
                            hand: "1h",
                            damage: "1d4",
                            damage_type: "piercing",
                            weapon_type: "simple",
                            thrown: true,
                            finesse: true,
                            light: true
                        };
                        char.weapons.push(dagger2);
                        // 20 bolts
                        bolt =
                        {
                            name: "bolt",
                            amount: 20
                        };
                        char.items.push(bolt);
                        // Leather armor
                        leather_armor =
                        {
                            name: "leather armor",
                            type: "light",
                            ac: 11
                        };
                        char.armor_equipped.push(leather_armor);
                        // Backpack
                        backpack =
                        {
                            name: "backpack",
                            amount: 1
                        };
                        char.items.push(backpack);
                        // Book of lore
                        book_of_lore =
                        {
                            name: "book of lore",
                            amount: 1
                        };
                        char.items.push(book_of_lore);
                        // Bottle of ink
                        bottle_of_ink =
                        {
                            name: "bottle of ink",
                            amount: 1
                        };
                        char.items.push(bottle_of_ink);
                        // Ink pen
                        ink_pen =
                        {
                            name: "ink pen",
                            amount: 1
                        };
                        char.items.push(ink_pen);
                        // 10 sheets of parchment
                        parchment =
                        {
                            name: "parchment",
                            amount: 1
                        };
                        char.items.push(parchment);
                        // Bag of sand
                        bag_of_sand =
                        {
                            name: "little bag of sand",
                            amount: 1
                        };
                        char.items.push(bag_of_sand);
                        // Small knife
                        small_knife =
                        {
                            name: "small knife",
                            amount: 1
                        };
                        char.items.push(small_knife);

                        // Prompt user to set skills
                        message.channel.send("Please choose 2 of the following skills: **Arcana**, **Deception**, **History**, **Intimidation**, **Investigation**, **Nature**, **Religion**");
                        return message.channel.send("You can choose skills by using the **!dnd skills [skill 1] [skill 2]** command.");
                    }

                    // Add Wizard saving throws, proficiencies and starting items
                    // Then prompt user to choose skills
                    else if(char_class == "wizard")
                    {
                        //  Saving throws
                        char.saving_throws.push("intelligence", "wisdom");
                        // Weapon proficiencies
                        char.weapon_proficiencies.push("dagger", "dart", "sling", "quarterstaff", "light crossbow");
                        
                        // Quarterstaff
                        quarterstaff =
                        {
                            name: "quarterstaff",
                            hand: "v",
                            damage: "1d6",
                            damage_type: "bludgeoning",
                            weapon_type: "simple",
                            thrown: false,
                            finesse: false,
                            light: false
                        };
                        char.weapons_equipped.push(quarterstaff);
                        // Backpack
                        backpack =
                        {
                            name: "backpack",
                            amount: 1
                        };
                        char.items.push(backpack);
                        // Book of lore
                        book_of_lore =
                        {
                            name: "book of lore",
                            amount: 1
                        };
                        char.items.push(book_of_lore);
                        // Bottle of ink
                        bottle_of_ink =
                        {
                            name: "bottle of ink",
                            amount: 1
                        };
                        char.items.push(bottle_of_ink);
                        // Ink pen
                        ink_pen =
                        {
                            name: "ink pen",
                            amount: 1
                        };
                        char.items.push(ink_pen);
                        // 10 sheets of parchment
                        parchment =
                        {
                            name: "parchment",
                            amount: 1
                        };
                        char.items.push(parchment);
                        // Bag of sand
                        bag_of_sand =
                        {
                            name: "little bag of sand",
                            amount: 1
                        };
                        char.items.push(bag_of_sand);
                        // Small knife
                        small_knife =
                        {
                            name: "small knife",
                            amount: 1
                        };
                        char.items.push(small_knife);

                        // Prompt user to set skills
                        message.channel.send("Please choose 2 of the following skills: **Arcana**, **History**, **Insight**, **Investigation**, **Medicine**, **Religion**.");
                        return message.channel.send("You can choose skills by using the **!dnd skills [skill 1] [skill 2]** command.");
                    }

                    // This else block should never be executed.
                    // Used to have player set attributes after character creation.
                    // Setting skills first then attributes is better.
                    else
                    {
                        message.channel.send("Set character attributes with the **!dnd attributes [STR] [DEX] [CON] [INT] [WIS] [CHR]** command.");
                        if(server[message.guild.id].i == 0)
                        {
                            message.channel.send("Replace attribute placeholders above with desired value of attribute.");
                            server[message.guild.id].i = server[message.guild.id].i + 1;
                            return message.channel.send("Use https://chicken-dinner.com/5e/5e-point-buy.html#customrace&NA&8&8&8&8&8&8&0&0&27&15&8&19&15&12&9&7&5&4&3&2&1&0&1&2&4&6&9&4&4&4&4&4&4 for help with attributes.");
                        }
                        else
                            return message.channel.send("Replace attribute placeholders above with desired value of attribute.");
                    
                    }
                }

                // ******************************** DELETE CHARACTER **********************************************
                else if(action == "delete")
                {
                    // Find player character
                    var i = server[message.guild.id].players.indexOf(message.author.username);
                    
                    // Delete character
                    if(i > -1)
                    {
                        message.channel.send(`${server[message.guild.id].characters[i].name} was deleted.`);
                        server[message.guild.id].characters.splice(i, 1);
                        server[message.guild.id].players.splice(i, 1);
                        return;
                    }

                    // No character to delete
                    return message.channel.send("You have no characters to delete.");
                }

                // ******************************** SET PLAYER SKILLS **********************************************
                else if(action == "skills")
                {
                    // Variables
                    var i; // counter
                    var skill; // Will hold skill name in all lowercase
                    var j = server[message.guild.id].players.indexOf(message.author.username); // Find player index
                    const char_class = server[message.guild.id].characters[j].char_class; // Player class

                    // Add skills
                    for (i = 2; i < args.length; i++)
                    {
                        // All letters of skill to lowercase
                        skill = args[i].toLowerCase();

                        // Add Barbarian skills
                        if(char_class == "barbarian")
                        {
                            if(server[message.guild.id].characters[j].skills.length == 2)
                                return message.channel.send("You already have 2 skills.");
                            if(skill == "animal")
                            {
                                server[message.guild.id].characters[j].skills.push("animal handling");
                                i = i + 1;
                            }
                            else if(skill != "athletics" && skill != "intimidation" && skill != "nature" && skill != "perception" && skill != "survival")
                                return message.channel.send(`${args[i]} is an invalid Barbarian skill.`);
                            else
                                server[message.guild.id].characters[j].skills.push(skill);
                        }

                        // Add Bard skills
                        else if(char_class == "bard")
                        {
                            if(server[message.guild.id].characters[j].skills.length == 3)
                                return message.channel.send("You already have 3 skills.");

                            if(skill == "animal")
                            {
                                server[message.guild.id].characters[j].skills.push("animal handling");
                                i = i + 1;
                            }

                            else if(skill == "sleight")
                            {
                                server[message.guild.id].characters[j].skills.push("sleight of hand");
                                i = i + 2;
                            }
                            
                            else
                                server[message.guild.id].characters[j].skills.push(skill);
                        }

                        // Add Cleric skills
                        else if(char_class == "cleric")
                        {
                            if(server[message.guild.id].characters[j].skills.length == 2)
                                return message.channel.send("You already have 2 skills.");
                            if(skill != "history" && skill != "insight" && skill != "medicine" && skill != "persuasion" && skill != "religion")
                                return message.channel.send(`${args[i]} is an invalid Cleric skill.`);
                            else
                                server[message.guild.id].characters[j].skills.push(skill);
                        }

                        // Add Druid skills
                        else if(char_class == "druid")
                        {
                            if(server[message.guild.id].characters[j].skills.length == 2)
                                return message.channel.send("You already have 2 skills.");
                            if(skill == "animal")
                            {
                                server[message.guild.id].characters[j].skills.push("animal handling");
                                i = i + 1;
                            }
                            else if(skill != "arcana" && skill != "insight" && skill != "medicine" && skill != "nature" && skill != "perception" && skill != "religion" && skill != "survival")
                                return message.channel.send(`${args[i]} is an invalid Druid skill.`);
                            else
                                server[message.guild.id].characters[j].skills.push(skill);
                        }

                        // Add Fighter skills
                        else if(char_class == "fighter")
                        {
                            if(server[message.guild.id].characters[j].skills.length == 2)
                                return message.channel.send("You already have 2 skills.");
                            if(skill == "animal")
                            {
                                server[message.guild.id].characters[j].skills.push("animal handling");
                                i = i + 1;
                            }
                            else if(skill != "acrobatics" && skill != "athletics" && skill != "history" && skill != "insight" && skill != "intimidation" && skill != "perception" && skill != "survival")
                                return message.channel.send(`${args[i]} is an invalid Fighter skill.`);
                            else
                                server[message.guild.id].characters[j].skills.push(skill);
                        }

                        // Add Monk skills
                        else if(char_class == "monk")
                        {
                            if(server[message.guild.id].characters[j].skills.length == 2)
                                return message.channel.send("You already have 2 skills.");
                            if(skill != "acrobatics" && skill != "athletics" && skill != "history" && skill != "insight" && skill != "religion" && skill != "stealth")
                                return message.channel.send(`${args[i]} is an invalid Monk skill.`);
                            else
                                server[message.guild.id].characters[j].skills.push(skill);
                        }

                        // Add Paladin skills
                        else if(char_class == "paladin")
                        {
                            if(server[message.guild.id].characters[j].skills.length == 2)
                                return message.channel.send("You already have 2 skills.");
                            if(skill != "athletics" && skill != "insight" && skill != "intimidation" && skill != "medicine" && skill != "persuasion" && skill != "religion")
                                return message.channel.send(`${args[i]} is an invalid Paladin skill.`);
                            else
                                server[message.guild.id].characters[j].skills.push(skill);
                        }

                        // Add Ranger skills
                        else if(char_class == "ranger")
                        {
                            if(server[message.guild.id].characters[j].skills.length == 3)
                                return message.channel.send("You already have 3 skills.");
                            if(skill == "animal")
                            {
                                server[message.guild.id].characters[j].skills.push("animal handling");
                                i = i + 1;
                            }
                            else if(skill != "athletics" && skill != "insight" && skill != "investigation" && skill != "nature" && skill != "perception" && skill != "stealth" && skill != "survival")
                                return message.channel.send(`${args[i]} is an invalid Ranger skill.`);
                            else
                                server[message.guild.id].characters[j].skills.push(skill);
                        }

                        // Add Rogue skills
                        else if(char_class == "rogue")
                        {
                            if(server[message.guild.id].characters[j].skills.length == 4)
                                return message.channel.send("You already have 4 skills.");
                            if(skill == "sleight")
                            {
                                server[message.guild.id].characters[j].skills.push("sleight of hand");
                                i = i + 2;
                            }
                            else if(skill != "acrobatics" && skill != "athletics" && skill != "deception" && skill != "insight" && skill != "intimidation" && skill != "investigation" && skill != "perception" && skill != "performance" && skill != "persuasion" && skill != "stealth")
                                return message.channel.send(`${args[i]} is an invalid Rogue skill.`);
                            else
                                server[message.guild.id].characters[j].skills.push(skill);
                        }

                        // Add Sorcerer skills
                        else if(char_class == "sorcerer")
                        {
                            if(server[message.guild.id].characters[j].skills.length == 2)
                                return message.channel.send("You already have 2 skills.");
                            if(skill != "arcana" && skill != "deception" && skill != "insight" && skill != "intimidation" && skill != "persuasion" && skill != "religion")
                                return message.channel.send(`${args[i]} is an invalid Ranger skill.`);
                            else
                                server[message.guild.id].characters[j].skills.push(skill);
                        }

                        // Add Warlock skills
                        else if(char_class == "warlock")
                        {
                            if(server[message.guild.id].characters[j].skills.length == 2)
                                return message.channel.send("You already have 2 skills.");
                            if(skill != "arcana" && skill != "deception" && skill != "history" && skill != "intimidation" && skill != "investigation" && skill != "nature" && skill != "religion")
                                return message.channel.send(`${args[i]} is an invalid Warlock skill.`);
                            else
                                server[message.guild.id].characters[j].skills.push(skill);
                        }

                        // Add Wizard skills
                        else if(char_class == "wizard")
                        {
                            if(server[message.guild.id].characters[j].skills.length == 2)
                                return message.channel.send("You already have 2 skills.");
                            if(skill != "arcana" && skill != "history" && skill != "insight" && skill != "investigation" && skill != "medicine" && skill != "religion")
                                return message.channel.send(`${args[i]} is an invalid Wizard skill.`);
                            else
                                server[message.guild.id].characters[j].skills.push(skill);
                        }

                        // This else block should never be executed
                        else
                            message.channel.send("I FUCKED UP!");
                    }

                        // Prompt user to set attributes
                        message.channel.send("Skills set!");
                        message.channel.send("Set character attributes with the **!dnd attributes [STR] [DEX] [CON] [INT] [WIS] [CHR]** command.");
                        if(server[message.guild.id].i == 0)
                        {
                            message.channel.send("Replace attribute placeholders above with desired value of attribute.");
                            server[message.guild.id].i = server[message.guild.id].i + 1;
                            return message.channel.send("Use https://chicken-dinner.com/5e/5e-point-buy.html#customrace&NA&8&8&8&8&8&8&0&0&27&15&8&19&15&12&9&7&5&4&3&2&1&0&1&2&4&6&9&4&4&4&4&4&4 for help with attributes.");
                        }
                        else
                            return message.channel.send("Replace attribute placeholders above with desired value of attribute.");
                }

                // ******************************** SET CHARACTER ATTRIBUTES **********************************************
                else if(action == "attributes")
                {
                    // User provided invalid number of arguments
                    if(args.length != 8)
                    {
                        message.channel.send("Invalid number of argument supplied.");
                        return message.channel.send("Set character attributes with the **!dnd attributes [STR] [DEX] [CON] [INT] [WIS] [CHR]** command.");
                    }

                    // User tried to set attributes without creating a character first
                    if(server[message.guild.id].players.indexOf(message.author.username) == -1)
                    {
                        message.channel.send("You have not created a character yet.");
                        return message.channel.send("Use the **!dnd character \"[name]\" [class] [race]** command to create character.");
                    }

                    // Number of points to spend
                    var points = 27;

                    // User provided invalid strength attribute
                    if(!(Number.isInteger(Number(args[2]))) || args[2] < 8 || args[2] > 15)
                    {
                        message.channel.send("Invalid strength attribute value.");
                        return message.channel.send("Attribute values should be integers between 8-15.");
                    }

                    // Subtract points
                    if(args[2] == 14)
                        points = points - 7;
                    else if(args[2] == 15)
                        points = points - 9;
                    else
                        points = points - (args[2] - 8);

                    // // User provided invalid dexterity attribute
                    if(!(Number.isInteger(Number(args[3]))) || args[3] < 8 || args[3] > 15)
                    {
                        message.channel.send("Invalid dexterity attribute value.");
                        return message.channel.send("Attribute values should be integers between 8-15.");
                    }

                    // Subtract points
                    if(args[3] == 14)
                        points = points - 7;
                    else if(args[3] == 15)
                        points = points - 9;
                    else
                        points = points - (args[3] - 8);

                    // User provided invalid constitution attribute 
                    if(!(Number.isInteger(Number(args[4]))) || args[4] < 8 || args[4] > 15)
                    {
                        message.channel.send("Invalid constitution attribute value.");
                        return message.channel.send("Attribute values should be integers between 8-15.");
                    }

                    // Subtract points
                    if(args[4] == 14)
                        points = points - 7;
                    else if(args[4] == 15)
                        points = points - 9;
                    else
                        points = points - (args[4] - 8);

                    // User provided invalid intelligence attribute
                    if(!(Number.isInteger(Number(args[5]))) || args[5] < 8 || args[5] > 15)
                    {
                        message.channel.send("Invalid intelligence attribute value.");
                        return message.channel.send("Attribute values should be integers between 8-15.");
                    }

                    // Subtract points
                    if(args[5] == 14)
                        points = points - 7;
                    else if(args[5] == 15)
                        points = points - 9;
                    else
                        points = points - (args[5] - 8);

                    // User provided invalid wisdom attribute
                    if(!(Number.isInteger(Number(args[6]))) || args[6] < 8 || args[6] > 15)
                    {
                        message.channel.send("Invalid wisdom attribute value.");
                        return message.channel.send("Attribute values should be integers between 8-15.");
                    }

                    // Subtract points
                    if(args[6] == 14)
                        points = points - 7;
                    else if(args[6] == 15)
                        points = points - 9;
                    else
                        points = points - (args[6] - 8);

                    // User provided invalid charisma attribute
                    if(!(Number.isInteger(Number(args[7]))) || args[7] < 8 || args[7] > 15)
                    {
                        message.channel.send("Invalid charisma attribute value.");
                        return message.channel.send("Attribute values should be integers between 8-15.");
                    }

                    // Subtract points
                    if(args[7] == 14)
                        points = points - 7;
                    else if(args[7] == 15)
                        points = points - 9;
                    else
                        points = points - (args[7] - 8);

                    // User spent too many points
                    if(points < 0)
                    {
                        message.channel.send("Too many points spent. You have 27 points to spend. Don't include racial bonuses in attribute values.");
                        return message.channel.send("Use https://chicken-dinner.com/5e/5e-point-buy.html#customrace&NA&8&8&8&8&8&8&0&0&27&15&8&19&15&12&9&7&5&4&3&2&1&0&1&2&4&6&9&4&4&4&4&4&4 for help with attributes.");
                    }

                    // User didn't spend all their points
                    else if(points < 0)
                    {
                        message.channel.send("You have unspent points.");
                        return message.channel.send("You can redo your attributes with the **!dnd attributes [STR] [DEX] [CON] [INT] [WIS] [CHR]** command.");
                    }

                    // User spent all their points, output their character
                    else
                    {
                        // Find player character
                        var i = server[message.guild.id].players.indexOf(message.author.username);

                        // Set player's strength attribute
                        if(server[message.guild.id].characters[i].race == "orc")
                            server[message.guild.id].characters[i].strength = Number(args[2]) + 2;
                        else if(server[message.guild.id].characters[i].race == "human")
                            server[message.guild.id].characters[i].strength = Number(args[2]) + 1;
                        else
                            server[message.guild.id].characters[i].strength = Number(args[2]);

                        // Set player's dexterity attribute
                        if(server[message.guild.id].characters[i].race == "elf" || server[message.guild.id].characters[i].race == "halfling")
                            server[message.guild.id].characters[i].dexterity = Number(args[3]) + 2;
                        else if(server[message.guild.id].characters[i].race == "human")
                            server[message.guild.id].characters[i].dexterity = Number(args[3]) + 1;
                        else
                            server[message.guild.id].characters[i].dexterity = Number(args[3]);

                        // Set player's constitution attribute
                        if(server[message.guild.id].characters[i].race == "dwarf")
                            server[message.guild.id].characters[i].constitution = Number(args[4]) + 2;
                        else if(server[message.guild.id].characters[i].race == "human" || server[message.guild.id].characters[i].race == "orc")
                            server[message.guild.id].characters[i].constitution = Number(args[4]) + 1;
                        else
                            server[message.guild.id].characters[i].constitution = Number(args[4]);

                        // Set player's intelligence attribute
                        if(server[message.guild.id].characters[i].race == "gnome")    
                            server[message.guild.id].characters[i].intelligence = Number(args[5]) + 2;
                        else if(server[message.guild.id].characters[i].race == "human")
                            server[message.guild.id].characters[i].intelligence = Number(args[5]) + 1;
                        else
                            server[message.guild.id].characters[i].intelligence = Number(args[5]);

                        // Set player's wisdom attribute
                        if(server[message.guild.id].characters[i].race == "human")
                            server[message.guild.id].characters[i].wisdom = Number(args[6]) + 1;
                        else
                            server[message.guild.id].characters[i].wisdom = Number(args[6]);

                        // Set player's charisma attribute
                        if(server[message.guild.id].characters[i].race == "human")
                            server[message.guild.id].characters[i].charisma = Number(args[7]) + 1;
                        else
                            server[message.guild.id].characters[i].charisma = Number(args[7]);

                        // Set player's hitpoints
                        const char = server[message.guild.id].characters[i];
                        if(char.char_class == "barbarian")
                            char.hit_points = 12 + char.constitution;
                        else if(char.char_class == "fighter" || char.char_class == "paladin" || char.char_class == "ranger")
                            char.hit_points = 10 + char.constitution;
                        else if(char.char_class == "sorcerer" || char.char_class == "wizard")
                            char.hit_points = 6 + char.constitution;
                        else
                            char.hit_points = 8 + char.constitution;
                        
                        var z;
                        // Output player's character
                        message.channel.send("**PLAYER INFO**");
                        message.channel.send(`Name: ${char.name}`);
                        message.channel.send(`Class: ${char.char_class.charAt(0).toUpperCase() + char.char_class.slice(1)}`);
                        message.channel.send(`Race: ${char.race.charAt(0).toUpperCase() + char.race.slice(1)}`);
                        message.channel.send(`HP: ${char.hit_points}`);
                        message.channel.send(`Saving throws: ${char.saving_throws[0]}, ${chra.saving_throws[1]}`);
                        message.channel.send("**------------------------**");
                        message.channel.send("**SKILLS**");
                        for(z = 0; z < char.skills.length; z++)
                            message.channel.send(`${char.skills[z].charAt(0).toUpperCase() + char.skills[z].slice(1)}`);
                        message.channel.send("**------------------------**");
                        message.channel.send("**ATTRIBUTES**");
                        message.channel.send(`Strength: ${char.strength}`);
                        message.channel.send(`Dexterity: ${char.dexterity}`);
                        message.channel.send(`Constitution: ${char.constitution}`);
                        message.channel.send(`Intelligence: ${char.intelligence}`);
                        message.channel.send(`Wisdom: ${char.wisdom}`);
                        message.channel.send(`Charisma: ${char.charisma}`);
                        message.channel.send("**------------------------**");
                        return message.channel.send(`Good luck ${char.name}! May you not die a horrible death :)`);
                    }

                }

                else if(action == "info")
                {
                    // Find player character
                    var i = server[message.guild.id].players.indexOf(message.author.username);
                    const char = server[message.guild.id].characters[i];

                    // Player has not created a character yet
                    if(i == -1)
                        return message.channel.send("Please create a character before using the !dnd info command.");

                    // Output player's character
                    message.channel.send("**PLAYER INFO**");
                    message.channel.send(`Name: ${char.name}`);
                    message.channel.send(`Class: ${char.char_class.charAt(0).toUpperCase() + char.char_class.slice(1)}`);
                    message.channel.send(`Race: ${char.race.charAt(0).toUpperCase() + char.race.slice(1)}`);
                    message.channel.send(`HP: ${char.hit_points}`);
                    message.channel.send(`Saving throws: ${char.saving_throws[0]}, ${chra.saving_throws[1]}`);
                    message.channel.send("**------------------------**");
                    message.channel.send("**SKILLS**");
                    for(z = 0; z < char.skills.length; z++)
                        message.channel.send(`${char.skills[z].charAt(0).toUpperCase() + char.skills[z].slice(1)}`);
                    message.channel.send("**------------------------**");
                    message.channel.send("**ATTRIBUTES**");
                    message.channel.send(`Strength: ${char.strength}`);
                    message.channel.send(`Dexterity: ${char.dexterity}`);
                    message.channel.send(`Constitution: ${char.constitution}`);
                    message.channel.send(`Intelligence: ${char.intelligence}`);
                    message.channel.send(`Wisdom: ${char.wisdom}`);
                    message.channel.send(`Charisma: ${char.charisma}`);
                    return message.channel.send("**------------------------**");
                }

                // ******************************** INVALID ACTION PROVIDED **********************************************
                else
                    return message.channel.send("That DND action does not exist.");
            }
        }
        // Log error
        catch(error)
        {
            console.log(error);
        }
    },
};