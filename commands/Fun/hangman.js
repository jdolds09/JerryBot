const Hangman = require("../../classes/Hangman"); // Hangman class to get variables
const Attachment = require('discord.js'); // Needed to send Hangman images
const random_word = require('random-words'); // Needed to create new word when player wins or loses

// Hangman command
module.exports = {
	name: 'hangman',
	description: 'Play hangman game.',
    execute(message) 
    {
        // Get letter used after !Hangman command
        const args = message.content.split(" ");
        const letter = args[1].charAt(0);

        // If letter guessed is in word
        if(Hangman.word.includes(letter))
        {
            // Add letters guessed correctly to array 
            Hangman.letters.push(letter);

            // Output picture of current state of Hangman game
            const attachment = new Attachment(`../../images/hangman_${Hangman.strikes}.png`);
            message.channel.send(attachment);

            // Output current state of game
            var i = 0;

            for(i = 0; i < Hangman.word_length; i++)
            {
                if(Hangman.letters.includes(Hangman.word.charAt(i)))
                {
                    message.channel.send(`${letter} `);
                    Hangman.hits = Hangman.hits + 1;
                }
                else
                {
                    message.channel.send('- ');
                }
            }

            // Check to see if player won
            if(Hangman.hits == Hangman.word_length)
            {
                message.channel.send("**YOU WIN!**");
                Hangman.word = random_word();
                Hangman.word_length = Hangman.word.length;
                Hangman.hits = 0;
                Hangman.strikes = 0;
                Hangman.letters = [];
            }
        }

        // If letter guessed is not in word
        if(Hangman.word.includes(letter))
        {
            // Add one to letters incorrectly guessed
            Hangman.strikes = Hangman.strikes + 1;

            // Output picture of current state of Hangman game
            const attachment = new Attachment(`../../images/hangman_${Hangman.strikes}.png`);
            message.channel.send(attachment);

            // Output current state of game
            var i = 0;

            for(i = 0; i < Hangman.word_length; i++)
            {
                if(Hangman.letters.includes(Hangman.word.charAt(i)))
                {
                    message.channel.send(`${letter} `);
                    Hangman.hits = Hangman.hits + 1;
                }
                else
                {
                    message.channel.send('- ');
                }
            }

            // Check to see if player lost
            if(Hangman.strikes == 6)
            {
                message.channel.send("**HAHAHAHA YOU LOST DUMBASS!**");
                Hangman.word = random_word();
                Hangman.word_length = Hangman.word.length;
                Hangman.hits = 0;
                Hangman.strikes = 0;
                Hangman.letters = [];
            }
        }
    },
};