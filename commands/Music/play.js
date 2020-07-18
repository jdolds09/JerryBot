const ytdl = require("ytdl-core"); // For youtube functions
const YouTube = require("simple-youtube-api"); // For youtube playlist
const youtube = new YouTube("AIzaSyCkMLHynwJgJYQoGaIResXZxKUbC2euFfw"); // youtube API key

// Play command
module.exports = {
  name: "play",
  description: "Play a song in your channel!",
  async execute(message) {
    try {
      // Get youtube link after !play command
      const args = message.content.split(" ");
      // Create song queue
      const queue = message.client.queue;
      const serverQueue = message.client.queue.get(message.guild.id);
      // Variable to keep track of number of song in playlist
      var i = 0;

      // Get voice channel and check if user is currently in voice channel
      const voiceChannel = message.member.voice.channel;
      if (!voiceChannel)
        return message.channel.send(
          "You need to be in a voice channel to play music dumbass."
        );

      // Check to see if JerryBot has permissions to join and play music
      const permissions = voiceChannel.permissionsFor(message.client.user);
      if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send(
          "I need the permissions to join and speak in your voice channel!"
        );
      }

      // If queue hasnt been created yet
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

        // If bot is not currently playing a song and user wants to play a playlist
        if(args[1].match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/))
        {
          // Get playlist info
          const playlist = await youtube.getPlaylist(args[1]);
          const videos = await playlist.getVideos();

          // Get first song in playlist
          const video2 = await youtube.getVideoByID(videos[0].id);
          
          const song = {
          title: video2.title,
          url: `https://www.youtube.com/watch?v=${video2.id}`
          };
          queueContruct.songs.push(song);

          // Start playing first song in playlist
          try {
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;
            this.play(message, queueContruct.songs[0], true, videos, i);
          } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
          }
        }

        // Bot is not currently playing a song and user wants to play a single song
        else
        {
          // Get song info
          const songInfo = await ytdl.getInfo(args[1])
          const song = 
          {
            title: songInfo.title,
            url: songInfo.video_url
          };
          // Push the song onto the queue
          queueContruct.songs.push(song);

          // If no song is currently playing, then play the song given in the command
          try {
            var videos;
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;
            this.play(message, queueContruct.songs[0], false, videos, i);
          } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
          }
        }
      }

      // Tell user that queue must be empty if he/she wants to play songs from a YouTube playlist
      else 
      {
        if(args[1].match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/))
        {
          return message.channel.send("Song queue must be empty to start playing from a YouTube playlist.");
        }

        // Song is currently playing and user wants to add another song to queue
        else
        {
          // Get song info
          const songInfo = await ytdl.getInfo(args[1])
          const song = 
          {
            title: songInfo.title,
            url: songInfo.video_url
          };

          // Add song to queue
          serverQueue.songs.push(song);
          return message.channel.send(
            `**${song.title}** has been added to the queue!`
          );
        }
      }
      
    } catch (error) {
      console.log(error);
      message.channel.send(error.message);
    }
  },

// Play song function
  play(message, song, is_playlist, videos, i) {
    try
    {
      // Get queue
      const queue = message.client.queue;
      const guild = message.guild;
      const serverQueue = queue.get(message.guild.id);

      // Invalid song link
      // This also disconnects JerryBot from VC when there are no songs in queue
      if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
      }

      // Play song
      const dispatcher = serverQueue.connection
        .play(ytdl(song.url))
        .on("finish", () => {
          // Play next song in playlist
          if(is_playlist)
          {
            i = i + 1;
            if(i < videos.length)
            {
              
              const song = {
              title: videos[i].title,
              url: videos[i].url
              };
              console.log(song.title);
              serverQueue.songs.push(song);
            }
            serverQueue.songs.shift();
            this.play(message, serverQueue.songs[0], true, videos, i);
          }

          // Play next song in queue
          else
          {
            serverQueue.songs.shift();
            this.play(message, serverQueue.songs[0], false, videos, i);
          }

        })
        .on("error", error => console.error(error));
      dispatcher.setVolumeLogarithmic(serverQueue.volume / 9);
      serverQueue.textChannel.send(`Start playing: **${song.title}**`);
    }
    catch(error)
    {
      return console.log(error);
    }
  }
};