const random_word = require('random-words');

module.exports = class Hangman
{
    word;
    letters;
    hits;
    strikes;

    static get_word()
    {
        return this.word;
    }

    static get_letters()
    {
        return this.letters;
    }

    static get_hits()
    {
        return this.hits;
    }

    static get_strikes()
    {
        return this.strikes;
    }

    static push_letter(letter)
    {
        this.letters.push(letter);
    }

    static add_hit()
    {
        this.hits = this.hits + 1;
    }

    static add_strike()
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