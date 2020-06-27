const requestHandler = require("../handler");
module.exports = {
	name: 'butts',
	description: 'Post an image of a butt (Must be in NSFW channel).',
	execute(message) {
        if(!message.channel.nsfw)
            message.channel.send("Must be in a NSFW channel.");
        else
        {
            let subreddits = ["ass", "CuteLittleButts", "reversecowgirl",
            "facedownassup", "butt", "butts", "cosplaybutts", "girlsinyogapants", 
            "smalltitsbigass", "CelebrityButts", "booty", "NSFW_Pussy_Teen_Ass", "nsfw_college_ass",
            "beautiful_asses", "AsianAss", "cheekyasian", "ThatPerfectAss", "Top_Tier_Asses", "WhiteCheeks",
            "ASSians", "cuteAssCuterface", "AsianAsses", "CuteLittleButts", "brunetteass", "Blondeass", "Redheadass", "beautifulbutt"];
            result = requestHandler.makeRequest("reddit", subreddits[Math.floor(Math.random() *subreddits.length)]);
            console.log(result);
        }
	},
};