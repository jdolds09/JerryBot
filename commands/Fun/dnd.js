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
                strength: 8,
                dexterity: 8,
                constitution: 8,
                intelligence: 8,
                wisdom: 8,
                charisma: 8,
                hit_points: 8,
                armor_proficiencies: [],
                weapon_proficiencies: [],
                tool_proficiencies: [],
                tools: [],
                saving_throws: [],
                skills: [],
                items: [],
                weapons: [],
                armor: [],
                weapons_equipped: [],
                armor_equipped: [],
                offhand_free: false
            };

            // Item object
            item =
            {
                // Item attributes
                name: "",
                amount: 0
            };

            // Weapon object
            weapon =
            {
                // Weapon attributes
                name: "",
                hand: "",
                damage: "",
                damage_type: "",
                weapon_type: "",
                thrown: false,
                finesse: false,
                light: false
            };

            // Armor object
            armor =
            {
                name: "",
                type: "",
                ac: 0,
            };

            // Tool object
            tool =
            {
                name: "",
                type: "",
                amount: 0
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
                    if(char.weapons.length == 0 && char.weapons.length == 0)
                        message.channel.send("None");

                    // Output weapons
                    for(i = 0; i < char.weapons_equipped.length; i++)
                        message.channel.send(`${char.weapons_equipped[i].charAt(0).toUpperCase() + char.weapons_equipped[i].slice(1)} (equipped)`);
                    for(i = 0; i < char.weapons.length; i++)
                        message.channel.send(`${char.weapons[i].charAt(0).toUpperCase() + char.weapons[i].slice(1)}`);
                    
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
                    for(i = 0; i < char.armor_equipped.length; i++)
                        message.channel.send(`${char.armor_equipped[i].charAt(0).toUpperCase() + char.armor_equipped[i].slice(1)} (equipped)`);
                    for(i = 0; i < char.armor.length; i++)
                        message.channel.send(`${char.armor[i].charAt(0).toUpperCase() + char.armor[i].slice(1)}`);
                    
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
                            message.channel.send(`${char.items[i].charAt(0).toUpperCase() + char.items[i].slice(1)} x${char.items[i].amount}`);
                        else
                            message.channel.send(`${char.items[i].charAt(0).toUpperCase() + char.items[i].slice(1)}`);
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
                            message.channel.send(`${char.tools[i].charAt(0).toUpperCase() + char.tools[i].slice(1)} x${char.tools[i].amount}`);
                        else
                            message.channel.send(`${char.tools[i].charAt(0).toUpperCase() + char.tools[i].slice(1)}`);
                    }
                    return message.channel.send("**---------------------------**");
                }

                // ******************************** EQUIP WEAPON/ARMOR **********************************************
                else if(action == "equip")
                {
                    // Counters
                    var i = 3;
                    var k;
                    // Find player
                    var j = server[message.guild.id].players.indexOf(message.author.username);
                    var char = server[message.guild.id].characters[j];
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
                    if(gear_type != "weapon" || gear_type != "armor")
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
                            // Player wants to equip weapon in offhand   
                            if(char.weapons.indexOf(gear_name) != -1)
                            {
                                // Player tried to equip a weapon in the offhand with nothing in the mainhand
                                if(char.weapons_equipped.length == 0)
                                    return message.channel.send("Please equip a mainhand weapon first.");

                                // Weapon in mainhand is not light
                                if(char.weapons_equipped[0].light == false)
                                    return message.channel.send("Weapon in mainhand must be light to dual wield.");

                                // Weapon that the player wants to equip in the offhand is not light
                                if(char.weapons[char.weapons.indexOf(gear_name)].light == false)
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
                                        char.weapons_equipped.push(char.weapons.indexOf(gear_name));
                                        var x = char.weapons.indexOf(gear_name);
                                        char.weapons.splice(x, 1);
                                        return message.channel.send(`${gear_name} was equipped in the offhand.`);
                                    }
                                }
                                // Replace weapon that's already in offhand
                                else
                                {
                                    message.channel.send(`${char.weapons_equipped[1].name} in the offhand was unequipped.`);
                                    char.weapons.push(char.weapons_equipped[1]);
                                    char.weapons_equipped[1] = char.weapons[char.weapons.indexOf(gear_name)];
                                    var x = char.weapons.indexOf(gear_name);
                                    char.weapons.splice(x, 1);
                                    return message.channel.send(`${gear_name} was equipped in the offhand.`);
                                }
                            }
                        }
                    }

                    // Equip weapon in the main hand
                    if(char.weapons.indexOf(gear_name) != -1)
                    {
                        // If weapon that player wants to equip is light
                        if(char.weapons[char.weapons.indexOf(gear_name)].light == true)
                        {
                            // Replace the weapon that is already in the mainhand
                            if(char.weapons_equipped.length > 0)
                            {
                                message.channel.send(`${char.weapons_equipped[0].name} was unequipped.`);
                                char.weapons.push(char.weapons_equipped[0]);
                                var x = char.weapons.indexOf(gear_name);
                                char.weapons_equipped[0] = char.weapons[x];
                                char.weapons.splice(x, 1);
                                return message.channel.send(`${gear_name} was equipped.`);
                            }
                            
                            // No weapons are equipped
                            else
                            {
                                // Equip weapon
                                var x = char.weapons.indexOf(gear_name);
                                char.weapons_equipped.push(char.weapons[x]);
                                char.weapons.splice(x, 1);
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
                                    char.weapons_equipped[0] = char.weapons[char.weapons.indexOf(gear_name)];
                                    var x = char.weapons.indexOf(gear_name);
                                    char.weapons.splice(x, 1);
                                    return message.channel.send(`${gear_name} was equipped.`);
                                }
                                // Player is not dual wielding
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
                                    message.channel.send(`${char.weapons_equipped[0].name} was unequipped`);   
                                    char.weapons.push(char.weapons_equipped[0]);
                                    char.weapons_equipped[0] = char.weapons[char.weapons.indexOf(gear_name)];
                                    var x = char.weapons.indexOf(gear_name);
                                    char.weapons.splice(x, 1);
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
                                var x = char.weapons.indexOf(gear_name);
                                char.weapons_equipped.push(char.weapons[x]);
                                char.weapons.splice(x, 1);
                                return message.channel.send(`${gear_name} was equipped.`);
                            }
                        }
                    }

                    // Equip armor
                    if(char.armor.indexOf(gear_name) != -1)
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
                                var x = char.armor.indexOf(gear_name);
                                char.armor_equipped.push(char.armor[x]);
                                char.armor.splice(x, 1);
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
                            x = char.armor.indexOf(gear_name);
                            char.armor_equipped.push(char.armor[x]);
                            char.armor.splice(x, 1);
                            return message.channel.send(`${gear_name} was equipped.`);
                        }
                    }
                    return message.channel.send(`Could not equip ${gear_name}`);
                }

                // ******************************** UNEQUIP WEAPON/ARMOR **********************************************
                else if(action == "unequip")
                {
                    // Counter variable for number of args
                    var i = 3;

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
                        message.channel.send("Insufficient arguments supplied with **!dnd unequip** command.");
                        return message.channel.send("To equip armor or a weapon, use the **!dnd unequip [weapon/armor] \"[weapon/armor name]\" [offhand] <--(optional argument, must be a light weapon or shield)**");
                    }

                    // Gear variable will be equal to "weapon" or "armor" specifing what is being equipped
                    var gear_type = args[2].toLowerCase();
                    // User didn't specify if armor or weapon is being equipped
                    if(gear_type != "weapon" || gear_type != "armor")
                    {
                        message.channel.send("Please specify if a weapon or armor is being equipped.");
                        return message.channel.send("To equip armor or a weapon, use the **!dnd unequip [weapon/armor] \"[weapon/armor name]\" [offhand] <--(optional argument, must be a light weapon to put in offhand)**");
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

                    if(gear_type == "weapon")
                    {
                        if(char.weapons_equipped.indexOf(gear_name) != -1)
                        {
                            char.weapons.push(char.weapons_equipped[char.weapons_equipped.indexOf(gear_name)]);
                            char.weapons_equipped.slice(char.weapons_equipped.indexOf(gear_name), 1);
                            return message.channel.send(`${gear_name} was unequipped.`);
                        }
                    }

                    if(gear_type == "armor")
                    {
                        if(char.armor_equipped.indexOf(gear_name) != -1)
                        {
                            char.armor.push(char.armor_equipped[char.armor_equipped.indexOf(gear_name)]);
                            char.armor_equipped.slice(char.armor_equipped.indexOf(gear_name), 1);
                            return message.channel.send(`${gear_name} was unequipped.`);
                        }
                    }

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
                        // Add saving throws
                        char.saving_throws.push("strength, constitution");

                        // Add proficiencies
                        char.armor_proficiencies.push("light", "medium", "shield");
                        char.weapon_proficiencies.push("simple", "martial");
                        
                        // Add starting items
                        // Greataxe
                        weapon.name = "greataxe";
                        weapon.hand = "2h";
                        weapon.damage = "1d12";
                        weapon.damage_type = "slashing";
                        weapon.weapon_type = "martial";
                        weapon.thrown = false;
                        weapon.finesse = false;
                        weapon.light = false;
                        char.weapons_equipped.push(weapon);
                        char.offhand_free = false;
                        // 2 handaxes
                        weapon.name = "handaxe";
                        weapon.hand = "1h";
                        weapon.damage = "1d6";
                        weapon.damage_type = "slashing";
                        weapon.weapon_type = "simple";
                        weapon.thrown = true;
                        weapon.finesse = false;
                        weapon.light = true;
                        char.weapons.push(weapon);
                        char.weapons.push(weapon);
                        // 4 javelins
                        weapon.name = "javelin";
                        weapon.hand = "1h";
                        weapon.damage = "1d6";
                        weapon.damage_type = "piercing";
                        weapon.weapon_type = "simple";
                        weapon.thrown = true;
                        weapon.finesse = false;
                        weapon.light = false;
                        char.weapons.push(weapon);
                        char.weapons.push(weapon);
                        char.weapons.push(weapon);
                        char.weapons.push(weapon);
                        // backpack
                        item.name = "backpack";
                        item.amount = 1;
                        char.items.push(item);
                        // bedroll
                        item.name = "bedroll";
                        item.amount = 1;
                        char.items.push(item);
                        // mess kit
                        item.name = "mess kit";
                        item.amount = 1;
                        char.items.push(item);
                        // tinderbox
                        item.name = "tinderbox";
                        item.amount = 1;
                        char.items.push(item);
                        // 10 torches
                        item.name = "torch";
                        item.amount = 10;
                        char.items.push(item);
                        // 10 days of rations
                        item.name = "rations";
                        item.amount = 10;
                        char.items.push(item);
                        // waterskin
                        item.name = "waterskin";
                        item.amount = 1;
                        char.items.push(item);
                        // 50 feet of hempen rope
                        item.name = "hempen rope";
                        item.amount = 50;
                        char.items.push(item);

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
                        char.tool_proficiencies.push("musical instrument");

                         // Add starting items
                        // Rapier
                        weapon.name = "rapier";
                        weapon.hand = "1h";
                        weapon.damage = "1d8";
                        weapon.damage_type = "piercing";
                        weapon.weapon_type = "martial";
                        weapon.thrown = false;
                        weapon.finesse = true;
                        weapon.light = false;
                        char.weapons_equipped.push(weapon);
                        char.offhand_free = true;
                        // Dagger
                        weapon.name = "dagger";
                        weapon.hand = "1h";
                        weapon.damage = "1d4";
                        weapon.damage_type = "piercing";
                        weapon.weapon_type = "simple";
                        weapon.thrown = true;
                        weapon.finesse = true;
                        weapon.light = true;
                        char.weapons.push(weapon);
                        // Leather armor
                        armor.name = "leather armor";
                        armor.type = "light";
                        armor.ac = 11;
                        char.armor_equipped.push(armor);
                        // lute
                        tool.name = "lute";
                        tool.type = "musical instrument";
                        tool.amount = 1;
                        char.tools.push(tool);
                        // backpack
                        item.name = "backpack";
                        item.amount = 1;
                        char.items.push(item);
                        // bedroll
                        item.name = "bedroll";
                        item.amount = 1;
                        char.items.push(item);
                        // costume
                        item.name = "costume";
                        item.amount = 2;
                        char.items.push(item);
                        // 5 candles
                        item.name = "candle";
                        item.amount = 5;
                        char.items.push(item);
                        // 5 days of rations
                        item.name = "rations";
                        item.amount = 5;
                        char.items.push(item);
                        // waterskin
                        item.name = "waterskin";
                        item.amount = 1;
                        char.items.push(item);
                        // disguise kit
                        item.name = "disguise kit";
                        item.amount = 1;
                        char.items.push(item);

                        // Prompt user to set skills
                        message.channel.send("Please choose any 3 skills.");
                        return message.channel.send("You can choose skills by using the **!dnd skills [skill 1] [skill 2] [skill 3]** command.");
                    }

                    // Add Cleric saving throws, proficiencies and starting items
                    // Then prompt user to choose skills
                    else if(char_class == "cleric")
                    {
                        message.channel.send("Please choose 2 of the following skills: **History**, **Insight**, **Medicine**, **Persuasion**, **Religion**.");
                        return message.channel.send("You can choose skills by using the **!dnd skills [skill 1] [skill 2]** command.");
                    }

                    // Add Druid saving throws, proficiencies and starting items
                    // Then prompt user to choose skills
                    else if(char_class == "druid")
                    {
                        message.channel.send("Please choose 2 of the following skills: **Arcana**, **Animal Handling**, **Insight**, **Medicine**, **Nature**, **Perception**, **Religion**, **Survival**.");
                        return message.channel.send("You can choose skills by using the **!dnd skills [skill 1] [skill 2]** command.");
                    }

                    // Add Fighter saving throws, proficiencies and starting items
                    // Then prompt user to choose skills
                    else if(char_class == "fighter")
                    {
                        message.channel.send("Please choose 2 of the following skills: **Acrobatics**, **Animal Handling**, **Athletics**, **History**, **Insight**, **Intimidation**, **Perception**, **Survival**.");
                        return message.channel.send("You can choose skills by using the **!dnd skills [skill 1] [skill 2]** command.");
                    }

                    // Add Monk saving throws, proficiencies and starting items
                    // Then prompt user to choose skills
                    else if(char_class == "monk")
                    {
                        message.channel.send("Please choose 2 of the following skills: **Acrobatics**, **Athletics**, **History**, **Insight**, **Religion**, **Stealth**.");
                        return message.channel.send("You can choose skills by using the **!dnd skills [skill 1] [skill 2]** command.");
                    }

                    // Add Paladin saving throws, proficiencies and starting items
                    // Then prompt user to choose skills
                    else if(char_class == "paladin")
                    {
                        message.channel.send("Please choose 2 of the following skills: **Athletics**, **Insight**, **Intimidation**, **Medicine**, **Persuasion**, **Religion**.");
                        return message.channel.send("You can choose skills by using the **!dnd skills [skill 1] [skill 2]** command.");
                    }

                    // Add Ranger saving throws, proficiencies and starting items
                    // Then prompt user to choose skills
                    else if(char_class == "ranger")
                    {
                        message.channel.send("Please choose 3 of the following skills: **Animal Handling**, **Athletics**, **Insight**, **Investigation**, **Nature**, **Perception**, **Stealth**, **Survival**");
                        return message.channel.send("You can choose skills by using the **!dnd skills [skill 1] [skill 2] [skill 3]** command.");
                    }

                    // Add Rogue saving throws, proficiencies and starting items
                    // Then prompt user to choose skills
                    else if(char_class == "rogue")
                    {
                        message.channel.send("Please choose 4 of the following skills: **Acrobatics**, **Athletics**, **Deception**, **Insight**, **Intimidation**, **Investigation**, **Perception**, **Performance**, **Persuasion**, **Sleight of Hand**, **Stealth**.");
                        return message.channel.send("You can choose skills by using the **!dnd skills [skill 1] [skill 2] [skill 3] [skill 4]** command.");
                    }

                    // Add Sorcerer saving throws, proficiencies and starting items
                    // Then prompt user to choose skills
                    else if(char_class == "sorcerer")
                    {
                        message.channel.send("Please choose 2 of the following skills: **Arcana**, **Deception**, **Insight**, **Intimidation**, **Persuasion**, **Religion**.");
                        return message.channel.send("You can choose skills by using the **!dnd skills [skill 1] [skill 2]** command.");
                    }

                    // Add Warlock saving throws, proficiencies and starting items
                    // Then prompt user to choose skills
                    else if(char_class == "warlock")
                    {
                        message.channel.send("Please choose 2 of the following skills: **Arcana**, **Deception**, **History**, **Intimidation**, **Investigation**, **Nature**, **Religion**");
                        return message.channel.send("You can choose skills by using the **!dnd skills [skill 1] [skill 2]** command.");
                    }

                    // Add Wizard saving throws, proficiencies and starting items
                    // Then prompt user to choose skills
                    else if(char_class == "wizard")
                    {
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
                            if(skill != "animal handling" && skill != "athletics" && skill != "intimidation" && skill != "nature" && skill != "perception" && skill != "survival")
                                return message.channel.send(`${args[i]} is an invalid Barbarian skill.`);
                            else
                                server[message.guild.id].characters[j].skills.push(skill);
                        }

                        // Add Bard skills
                        else if(char_class == "bard")
                        {
                            if(server[message.guild.id].characters[j].skills.length == 3)
                                return message.channel.send("You already have 3 skills.");
                                
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
                            if(skill != "arcana" && skill != "animal handling" && skill != "insight" && skill != "medicine" && skill != "nature" && skill != "perception" && skill != "religion" && skill != "survival")
                                return message.channel.send(`${args[i]} is an invalid Druid skill.`);
                            else
                                server[message.guild.id].characters[j].skills.push(skill);
                        }

                        // Add Fighter skills
                        else if(char_class == "fighter")
                        {
                            if(server[message.guild.id].characters[j].skills.length == 2)
                                return message.channel.send("You already have 2 skills.");
                            if(skill != "acrobatics" && skill != "animal handling" && skill != "athletics" && skill != "history" && skill != "insight" && skill != "intimidation" && skill != "perception" && skill != "survival")
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
                            if(skill != "animal handling" && skill != "athletics" && skill != "insight" && skill != "investigation" && skill != "nature" && skill != "perception" && skill != "stealth" && skill != "survival")
                                return message.channel.send(`${args[i]} is an invalid Ranger skill.`);
                            else
                                server[message.guild.id].characters[j].skills.push(skill);
                        }

                        // Add Rogue skills
                        else if(char_class == "rogue")
                        {
                            if(server[message.guild.id].characters[j].skills.length == 4)
                                return message.channel.send("You already have 4 skills.");
                            if(skill != "acrobatics" && skill != "athletics" && skill != "deception" && skill != "insight" && skill != "intimidation" && skill != "investigation" && skill != "perception" && skill != "performance" && skill != "persuasion" && skill != "sleight of hand" && skill != "stealth")
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


                        // Output player's character
                        const char = server[message.guild.id].characters[i];
                        message.channel.send("**PLAYER INFO**");
                        message.channel.send(`Name: ${char.name}`);
                        message.channel.send(`Class: ${char.char_class.charAt(0).toUpperCase() + char.char_class.slice(1)}`);
                        message.channel.send(`Race: ${char.race.charAt(0).toUpperCase() + char.race.slice(1)}`);
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