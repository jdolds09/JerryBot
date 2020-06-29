const random_word = require('random-words');

module.exports = class Hangman
{
    word = random_word();
    letters = [];
    strikes = 0;
    hits = 0;

    get_word()
    {
        return this.word;
    }

    get_word_length()
    {
        return this.word.length;
    }

    get_letters()
    {
        return this.letters;
    }

    get_strikes()
    {
        return this.strikes;
    }

    get_hits()
    {
        return this.hits;
    }

    add_letter(letter)
    {
        this.letters.push(letter);
    }

    add_strike()
    {
        this.strikes = this.strikes + 1;
    }

    add_hit()
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