const random_word = require('random-words');

module.exports = class Hangman
{
    constructor()
    {
        this.word = random_word();
        this.letters = [];
        this.hits = 0;
        this.strikes = 0;
    }

    get_word()
    {
        return this.word;
    }

    get_letter()
    {
        return this.letters;
    }

    get_hits()
    {
        return this.hits;
    }

    get_strikes()
    {
        return this.strikes;
    }

    push_letter(letter)
    {
        this.letters.push(letter);
    }

    add_hit()
    {
        this.hits = this.hits + 1;
    }

    add_strike()
    {
        this.strikes = this.strikes + 1;
    }

    new_word()
    {
        this.word = random_word();
        this.letters = [];
        this.hits = 0;
        this.strikes = 0;
    }
};