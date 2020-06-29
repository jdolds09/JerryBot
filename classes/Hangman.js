const random_word = require('random-words');

module.exports = class Hangman
{
    word = random_word();
    word_length = word.length;
    letters = [];
    strikes = 0;
    hits = 0;

    static get_word()
    {
        return this.word;
    }

    static get_word_length()
    {
        return this.word_length;
    }

    static get_letters()
    {
        return this.letters;
    }

    static get_strikes()
    {
        return this.strikes;
    }

    static get_hits()
    {
        return this.hits;
    }

    static add_letter(letter)
    {
        this.letters.push(letter);
    }

    static add_strike()
    {
        this.strikes = this.strikes + 1;
    }

    static add_hit()
    {
        this.hits = this.hits + 1;
    }

    new_word()
    {
        this.word = random_word();
        this.word_length = this.word.length;
        this.letters = [];
        this.hits = 0;
        this.strikes = 0;
    }
};