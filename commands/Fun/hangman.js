const random_word = require('random-words');

// Hangman command
module.exports = {
	name: 'hangman',
	description: 'Play hangman game.',
    execute(message) 
    {
        var game_over = false;
        var quit = false;
        const word = random_word();
        var letters = [];
        var hits = 0;
        var strikes = 0;

        while(!game_over && !quit)
        {
            // Get letter used after !hangman command
            const args = message.content.split(" ");
            if(args[1].toLowerCase() == "quit")
                quit = true;
            else
            {
                const letter = args[1].charAt(0);

                // If letter guessed is in word
                if(word.includes(letter))
                {
                    // Add letters guessed correctly to array 
                    letters.push(letter);

                    // Output picture of current state of hangman game
                    message.channel.send("", {files: [`./images/hangman_${strikes}.png`]});

                    // Output current state of game
                    var i = 0;
                    var str = "";
                    for(i = 0; i < word.length; i++)
                    {
                        if(letters.includes(word.charAt(i)))
                        {
                            str += `${letter} `;
                            hits += 1;
                        }
                        else
                        {
                            str += "- ";
                        }
                    }

                    message.channel.send(str);

                    // Check to see if player won
                    if(hits == word.length)
                    {
                        message.channel.send("**YOU WIN!**");
                        game_over = true;
                    }
                }

                // If letter guessed is not in word
                else
                {
                    // Add one to letters incorrectly guessed
                    strikes += 1;

                    // Output picture of current state of hangman game
                    message.channel.send("", {files: [`./images/hangman_${strikes}.png`]});

                    // Output current state of game
                    var i = 0;
                    var str = "";
                    for(i = 0; i < word.length; i++)
                    {
                        if(letters.includes(word.charAt(i)))
                        {
                            str += `${letter} `;
                        }
                        else
                        {
                            str += '- ';
                        }
                    }

                    message.channel.send(str);

                    // Check to see if player lost
                    if(strikes == 6)
                    {
                        message.channel.send("**HAHAHAHA YOU LOST DUMBASS!**");
                        game_over = true;
                    }
                }
            }
        }
    },
};