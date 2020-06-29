const Attachment = require('discord.js'); // Needed to send hangman images
const random_word = require('random-words'); // Needed to create new word when player wins or loses
const Hangman = require('../../classes/Hangman');

// Hangman command
module.exports = {
	name: 'hangman',
	description: 'Play hangman game.',
    execute(message) 
    {
        const hangman = new Hangman();

        // Get letter used after !hangman command
        const args = message.content.split(" ");
        const letter = args[1].charAt(0);

        // If letter guessed is in word
        if(hangman.word.includes(letter))
        {
            // Add letters guessed correctly to array 
            hangman.letters.push(letter);

            // Output picture of current state of hangman game
            const attachment = new Attachment(`../../images/hangman_${hangman.strikes}.png`);
            message.channel.send(attachment);

            // Output current state of game
            var i = 0;

            for(i = 0; i < hangman.word_length; i++)
            {
                if(hangman.letters.includes(hangman.word.charAt(i)))
                {
                    message.channel.send(`${letter} `);
                    hangman.hits = hangman.hits + 1;
                }
                else
                {
                    message.channel.send('- ');
                }
            }

            // Check to see if player won
            if(hangman.hits == hangman.word_length)
            {
                message.channel.send("**YOU WIN!**");
                hangman.word = random_word();
                hangman.word_length = hangman.word.length;
                hangman.hits = 0;
                hangman.strikes = 0;
                hangman.letters = [];
            }
        }

        // If letter guessed is not in word
        if(hangman.word.includes(letter))
        {
            // Add one to letters incorrectly guessed
            hangman.strikes = hangman.strikes + 1;

            // Output picture of current state of hangman game
            const attachment = new Attachment(`../../images/hangman_${hangman.strikes}.png`);
            message.channel.send(attachment);

            // Output current state of game
            var i = 0;

            for(i = 0; i < hangman.word_length; i++)
            {
                if(hangman.letters.includes(hangman.word.charAt(i)))
                {
                    message.channel.send(`${letter} `);
                    hangman.hits = hangman.hits + 1;
                }
                else
                {
                    message.channel.send('- ');
                }
            }

            // Check to see if player lost
            if(hangman.strikes == 6)
            {
                message.channel.send("**HAHAHAHA YOU LOST DUMBASS!**");
                hangman.word = random_word();
                hangman.word_length = hangman.word.length;
                hangman.hits = 0;
                hangman.strikes = 0;
                hangman.letters = [];
            }
        }
    },
};