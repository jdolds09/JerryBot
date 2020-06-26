const ytdl = require("ytdl-core");

module.exports = {
  name: "play",
  description: "Play a song in your channel!",
  async execute(message) {
    try 
    {
      const args = message.content.split(" ");
      var servers = {};

      const voiceChannel = message.member.voice.channel;
      if (!voiceChannel)
        return message.channel.send(
          "You need to be in a voice channel to play music dumbass."
        );
      const permissions = voiceChannel.permissionsFor(message.client.user);
      if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send(
          "I need the permissions to join and speak in your voice channel!"
        );
      }

      const songInfo = await ytdl.getInfo(args[1]);
      const song = {
        title: songInfo.title,
        url: songInfo.video_url
      };

      if (!servers[message.guild.id]) 
      {
        servers[message.guild.id] = 
        {
          textChannel: message.channel,
          voiceChannel: voiceChannel,
          connection: null,
          songs: [],
          volume: 5,
        };

        try 
        {
          var connection = await voiceChannel.join();
          var server = servers[message.guild.id];
          server.connection = connection;
          server.songs.push(song);
          this.play(message, server);
        } 
        catch (err) 
        {
          console.log(err);
          return message.channel.send(err);
        }
      } 
      
      else 
      {
        servers[message.guild.id].songs.push(song);
        if(servers[message.guild.id].songs.length > 1)
          return message.channel.send(`${song.title} has been added to the queue!`);
      }
    } 
    
    catch (error) 
    {
      console.log(error);
      message.channel.send(error.message);
    }
  },

  play(message, server) {
    
    var song = server.songs[0];

    if (!song) 
    {
      server.voiceChannel.leave();
      return;
    }

    server.dispatcher = server.connection
      .play(ytdl(song.url, {filter: "audioonly"}))
      .on("end", () => {
        server.songs.shift();
        this.play(message, server.songs[0]);
      })
      .on("error", error => console.error(error));
    server.dispatcher.setVolumeLogarithmic(server.volume / 5);
    message.channel.send(`Start playing: **${song.title}**`);
  }
};