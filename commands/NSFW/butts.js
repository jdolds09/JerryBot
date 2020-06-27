const Images = require("dabi-images");
const Client = new Images.Client();

module.exports = {
	name: 'butts',
	description: 'Post an image of a butt (Must be in NSFW channel).',
    execute(message) 
    {
        try
        {
            Client.nsfw.real.butts().then(json => {
                console.log(json);
            })
        }
        catch(error)
        {
            console.log(error);
        }
    },
};