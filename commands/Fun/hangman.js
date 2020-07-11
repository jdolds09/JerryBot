const random_word = require('random-words');

// Hangman command
module.exports = {
	name: 'hangman',
	description: 'Play a game of hangman!',
    execute(message, servers) 
    {
        // Make hangman game unique to your discord server
        if(!servers[message.guild.id])
        {
            servers[message.guild.id] = 
            {
                // Hangman variables
                word: random_word(),
                letters: [],
                strikes: 0,
                hit: false,
                dashes: false
            };
        }

        // Get letter guessed
        const arguments = message.content.split(" ");
        const letter = arguments[1].charAt(0);
        const letter = letter.toLowerCase();

        // If letter guessed is in word
        if(servers[message.guild.id].word.includes(letter))
        {
            // If no dashes are output, this stays false and player wins
            servers[message.guild.id].dashes = false;
            // Add letters guessed correctly to array 
            servers[message.guild.id].letters.push(letter);

            // Output picture of current state of hangman game
            message.channel.send("", {files: [`./images/hangman_${servers[message.guild.id].strikes}.png`]});

            // Output current state of game
            var i = 0;
            var str = "";
            for(i = 0; i < servers[message.guild.id].word.length; i++)
            {
                servers[message.guild.id].hit = false;
                for(j = 0; j < servers[message.guild.id].letters.length; j++)
                {
                    if(servers[message.guild.id].letters[j] == servers[message.guild.id].word.charAt(i))
                    {
                        str += `${servers[message.guild.id].letters[j]} `;
                        servers[message.guild.id].hit = true;
                    }
                }
                if(!servers[message.guild.id].hit)
                {
                    str += '- ';
                    servers[message.guild.id].dashes = true;
                }
            }

            message.channel.send(str);

            // Check to see if player won
            if(!servers[message.guild.id].dashes)
            {
                message.channel.send("**YOU WIN!**");
                servers[message.guild.id].word = random_word();
                servers[message.guild.id].letters = [];
                servers[message.guild.id].strikes = 0;
            }
        }

        // If letter guessed is not in word
        else
        {
            // Add one to letters incorrectly guessed
            servers[message.guild.id].strikes += 1;

            // Output picture of current state of hangman game
            message.channel.send("", {files: [`./images/hangman_${servers[message.guild.id].strikes}.png`]});

            // Output current state of game
            var i = 0;
            var str = "";
            for(i = 0; i < servers[message.guild.id].word.length; i++)
            {
                servers[message.guild.id].hit = false;
                for(j = 0; j < servers[message.guild.id].letters.length; j++)
                {
                    if(servers[message.guild.id].letters[j] == servers[message.guild.id].word.charAt(i))
                    {
                        str += `${servers[message.guild.id].letters[j]} `;
                        servers[message.guild.id].hit = true;
                    }
                }
                if(!servers[message.guild.id].hit)
                    str += '- ';
            }

            message.channel.send(str);

            // Check to see if player lost
            if(servers[message.guild.id].strikes == 6)
            {
                message.channel.send(`**HAHAHAHA YOU LOST! THE WORD WAS __${servers[message.guild.id].word.toUpperCase()}__ DUMBASS!**`);
                servers[message.guild.id].word = random_word();
                servers[message.guild.id].letters = [];
                servers[message.guild.id].strikes = 0;
            }
        }
    },
};