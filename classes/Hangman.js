const random_word = require('random-words');

module.exports = class Hangman
{
    constructor()
    {
        this.word = random_word();
        this.word_length = this.word.length;
        this.letters = [];
        this.strikes = 0;
        this.hits = 0;
    }
};