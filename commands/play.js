const ytdl = require("ytdl-core");

module.exports = 
{
  name: "play",
  description: "Play a song in your channel!",
  async execute(message) 
  {
    try 
    {
      const args = message.content.split(" ");
      var servers = {};

      const voiceChannel = message.member.voice.channel;
      if (!voiceChannel)
        return message.channel.send("You need to be in a voice channel to play music dumbass.");
      const permissions = voiceChannel.permissionsFor(message.client.user);
      if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) 
      {
        return message.channel.send("I need the permissions to join and speak in your voice channel!");
      }

      const songInfo = await ytdl.getInfo(args[1]);
      const song = 
      {
        title: songInfo.title,
        url: songInfo.video_url
      };

      if(!servers[message.guild.id])
      {
        servers[message.guild.id] = 
        {
          queue: [],
          volume: 5,
          voiceChannel: voiceChannel,
          connection: null
        }

        servers[message.guild.id].queue.push(song);

        try
        {
          var connection = await voiceChannel.join();
          servers[message.guild.id].connection = connection;
          this.play(message, servers[message.guild.id].queue[0])
        }

        catch(err)
        {
          console.log(err);
          message.channel.send(err.message);
        }

      }
      
      else
      {
        servers[message.guild.id].queue.push(song);
        return message.channel.send(`${song.title} has been added to the queue.`)
      }
    } 
    
    catch (error) 
    {
      console.log(error);
      message.channel.send(error.message);
    }
  },

  play(message, song) {

    var server = servers[message.guild.id];

    if (!song) {
      server.queue.shift();
      return;
    }

    server.dispatcher = server.connection.play(ytdl(song.url, {filter: "audioonly"}));

    server.queue.shift();

    server.dispatcher.on("end", () => {
        if(server.queue[0])
        {
          this.play(message, song);
  		  }
      })
      .on("error", error => console.error(error));
    server.dispatcher.setVolumeLogarithmic(server.volume / 5);
    message.channel.send(`Start playing: **${song.title}**`);
  }
};
