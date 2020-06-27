const requestHandler = require("../handler");
module.exports = {
	name: 'boobs',
	description: 'Post an image of boobs (Must be in NSFW channel).',
	execute(message) {
        if(!message.channel.nsfw)
            message.channel.send("Must be in a NSFW channel.");
        else
        {
            let subreddits = ["bigtiddygothgf", "Titties", "BreastEnvy", "naturaltitties", "topless", "PerkierThanYouThought",
                            "just_tits", "Boobies", "tits", "ToplessInPanties", "showmeyourtits", "PetiteBoobBounce", "ToplessInYogaPants",
                            "Boobies_Are_Awesome", "toplesscelebs", "titsagainstglass", "bestofboobies", "perkytits", "PerfectWhiteBoobs",
                            "NiceTitties", "titsnboobs", "boobs", "BeautifulTitsAndAss", "Cumontits", "Topless_Vixens", "SmallerYetBigger",
                            "C_Cups", "NoTop", "RedditsBestTits", "aww_boobs", "amazingtits", "AmazingCurves", "snapchatboobs", "Perky",
                            "PerfectTits", "AmateurGotBoobs", "PM_ME_YOUR_TITS_GIRL", "BoobsParadise", "Perfect_Tits", "ChestEnvy", "SweetTitties", "OppaiHearts"];
            return requestHandler.makeRequest("reddit", subreddits[Math.floor(Math.random() *subreddits.length)]);
        }
	},
};