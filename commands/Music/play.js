const ytdl = require("ytdl-core");

module.exports = {
  name: "play",
  description: "Play a song in your channel!",
  async execute(message) {
    try {
      const args = message.content.split(" ");
      const queue = message.client.queue;
      const serverQueue = message.client.queue.get(message.guild.id);

      // Check to see if user is in voice channel
      const voiceChannel = message.member.voice.channel;
      if (!voiceChannel)
        return message.channel.send(
          "You need to be in a voice channel to play music!"
        );
      // Check to see if JerryBot has necessary permissions to play song in Discord server
      const permissions = voiceChannel.permissionsFor(message.client.user);
      if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send(
          "I need the permissions to join and speak in your voice channel!"
        );
      }

      // Get song info
      const songInfo = await ytdl.getInfo(args[1]);
      const song = {
        title: songInfo.title,
        url: songInfo.video_url
      };

      // If no song is currently playing, create queue
      if (!serverQueue) {
        const queueContruct = {
          textChannel: message.channel,
          voiceChannel: voiceChannel,
          connection: null,
          songs: [],
          volume: 2,
          playing: true
        };

        queue.set(message.guild.id, queueContruct);

        queueContruct.songs.push(song);

        // Join voice channel and play song
        try {
          var connection = await voiceChannel.join();
          queueContruct.connection = connection;
          this.play(message, queueContruct.songs[0]);
        } catch (err) {
          console.log(err);
          queue.delete(message.guild.id);
          return message.channel.send(err);
        }
      }
      
      // If song is currently playing, add song given in command to queue
      else {
        serverQueue.songs.push(song);
        return message.channel.send(
          `${song.title} has been added to the queue!`
        );
      }
    }

    catch (error) {
      console.log(error);
      message.channel.send(error.message);
    }
  },

  // Play song function
  play(message, song) {
    const queue = message.client.queue;
    const guild = message.guild;
    const serverQueue = queue.get(message.guild.id);

    // Invalid song
    if (!song) {
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }

    // Start playing son
    const dispatcher = serverQueue.connection
      .play(ytdl(song.url))
      .on("finish", () => {
        serverQueue.songs.shift();
        this.play(message, serverQueue.songs[0]);
      })
      .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 9);
    serverQueue.textChannel.send(`Start playing: **${song.title}**`);
  }
};