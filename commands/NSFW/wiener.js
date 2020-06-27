const requestHandler = require("../handler");
module.exports = {
	name: 'wiener',
	description: 'Post an image of a wiener (Must be in NSFW channel).',
	execute(message) {
        if(!message.channel.nsfw)
            message.channel.send("Must be in a NSFW channel.");
        else
        {
            let subreddits = ["MassiveCock", "blackcock",  "bigdicks", "penis", "BonersInPublic", "CumCocks", "penislover",
                            "cock", "softies", "Blackdick", "Boners", "NSFW_DICK_and_Cock", "WhipItOut", "sizecomparison",
                            "handsfree", "PENIS_PENIS_PENIS", "CutCocks", "dicks", "dickpic"];
            return requestHandler.makeRequest("reddit", subreddits[Math.floor(Math.random() *subreddits.length)]);
        }
	},
};