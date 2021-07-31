const ytdl = require('ytdl-core');
const queue = new Map();

async function execute(message,lien) {
    const serverQueue = queue.get(message.guild.id);

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
    {
        return message.channel.send("Vous devez être dans un salon vocal!");
    }
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send("J'ai besoin des permissions pour rejoindre le salon et pour y jouer de la musique!");
    }

    const songInfo = await ytdl.getInfo(lien);
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
    };

    if (!serverQueue) {
        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 1,
            playing: true,
        };

        queue.set(message.guild.id, queueConstruct);
        queueConstruct.songs.push(song);

        try {
            queueConstruct.connection = await voiceChannel.join();
            play(message.guild, queueConstruct.songs[0]);
        } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
        }
    } else {
        serverQueue.songs.push(song);
        console.log(serverQueue.songs);
        return message.channel.send(`${song.title} a était ajouter a la liste de lecture !`);
    }
}
function play(guild, song) {
    console.log(song);
    const serverQueue = queue.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection
        .play(ytdl(song.url, {filter: 'audioonly'}))
        .on("finish", () => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));
    dispatcher.setVolume(0.01);
    serverQueue.textChannel.send(`Démarrage de la musique: **${song.title}**`);
}

function skip(message) {
    const serverQueue = queue.get(message.guild.id);
    if (!message.member.voice.channel) {
        return message.channel.send(
            "Vous devez être dans un salon vocal pour passer une musique!"
        );
    }
    if (!serverQueue) {
        return message.channel.send("Aucune lecture de musique en cours !");
    }
    serverQueue.connection.dispatcher.end();
}

function stop(message) {
    const serverQueue = queue.get(message.guild.id);
    if (!message.member.voice.channel) {
        return message.channel.send(
            "Vous devez être dans un salon vocal pour stopper la lecture!"
        );
    }
    if (!serverQueue) {
        return message.channel.send("Aucune lecture de musique en cours !");
    }
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}

module.exports = {
    execute: execute,
    play: play,
    skip: skip,
    stop: stop,
}