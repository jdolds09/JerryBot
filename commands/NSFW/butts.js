const rp = require('random-puppy');

module.exports = {
	name: 'butts',
	description: 'Post an image of a butt (Must be in NSFW channel).',
    async execute(message) 
    {
        let subreddits = ["ass", "CuteLittleButts", "reversecowgirl",
                "facedownassup", "butt", "butts", "cosplaybutts", "girlsinyogapants", 
                "smalltitsbigass", "CelebrityButts", "booty", "NSFW_Pussy_Teen_Ass", "nsfw_college_ass",
                "beautiful_asses", "AsianAss", "cheekyasian", "ThatPerfectAss", "Top_Tier_Asses", "WhiteCheeks",
                "ASSians", "cuteAssCuterface", "AsianAsses", "CuteLittleButts", "brunetteass", "Blondeass", 
                "Redheadass", "beautifulbutt"];
                
        const sub = subreddits[Math.floor(Math.random() * subreddits.length)];

        if(!message.channel.nsfw)
            return message.channel.send("Must be in a NSFW channel.");

        else
        {
            try
            {
                const result = await rp(sub);
                if(result)
                    message.channel.send(result);
                else
                    message.channel.send("Result is empty");
            }

            catch (error)
            {
                console.log(error);
                message.channel.send("Imgur pic");
            }
        }
    },

    async imgur(sub)
    {
        try
        {
            var result = await rp(sub, "Imgur");
            message.channel.send(result);
        }

        catch (err)
        {
            console.log(error);
            return message.channel.send("There was an issue fetching a butt pic.");
        }
    }

};