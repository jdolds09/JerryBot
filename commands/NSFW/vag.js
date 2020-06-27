const requestHandler = require("../handler");
module.exports = {
	name: 'vag',
	description: 'Post an image of a vajayjay (Must be in NSFW channel).',
	execute(message) {
        if(!message.channel.nsfw)
            message.channel.send("Must be in a NSFW channel.");
        else
        {
            let subreddits = ["cameltoe", "cameltoepics", "ExtremeCameltoe", "shaved_asians", "pussy", "Innie",
                            "vagina", "AsianPussy", "Innies", "shavedgirls", "PerfectPussy", "TINYlips", "GodPussy",
                            "shavedpussies", "TinyAsianPussy", "CelebrityPussy", "PerfectPussies", "peachlips", "simps"];
            return requestHandler.makeRequest("reddit", subreddits[Math.floor(Math.random() *subreddits.length)]);
        }
	},
};