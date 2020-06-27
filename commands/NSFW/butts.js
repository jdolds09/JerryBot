const Search = require('random-puppy');

module.exports = {
	name: 'butts',
	description: 'Post an image of a butt (Must be in NSFW channel).',
	execute(message) {
        if(!message.channel.nsfw)
            message.channel.send("Must be in a NSFW channel.");
        else
        {
            try
            {
            let subreddits = ["ass", "CuteLittleButts", "reversecowgirl",
            "facedownassup", "butt", "butts", "cosplaybutts", "girlsinyogapants", 
            "smalltitsbigass", "CelebrityButts", "booty", "NSFW_Pussy_Teen_Ass", "nsfw_college_ass",
            "beautiful_asses", "AsianAss", "cheekyasian", "ThatPerfectAss", "Top_Tier_Asses", "WhiteCheeks",
            "ASSians", "cuteAssCuterface", "AsianAsses", "CuteLittleButts", "brunetteass", "Blondeass", "Redheadass", "beautifulbutt"];
            
            var sub = subreddits[Math.floor(Math.random() * subreddits.length)];
            Search(sub)
                .then(url => {
                    const embed = new Discord.MessageEmbed()
                        .setImage(url)
                        .setColor('RANDOM')
                        .setURL(url)
                        .setAuthor(url);
                    return message.channel.send({embed});
                })
            }

            catch (error)
            {
                message.channel.send("There was an issue fetching a butt pic.");
            }
        }
	},
};