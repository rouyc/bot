let Discord = require('discord.js');

let axios = require('axios');

let {
    prefix,
    startToken,
    midToken,
    endToken
} = require("./config/config.json");

let channelId = require("./config/channel_id.js");
let categoryId = require("./config/category_id.js");
let roleId = require("./config/role_id.js");
let emojiId = require("./config/emoji_id.js");
let embed = require('./config/embed.js');
let musique = require("./config/musique");

let usetube = require('usetube');

let token = startToken + midToken + endToken;

let clientDiscord = new Discord.Client({partials: ['MESSAGE', 'CHANNEL', 'REACTION']});

let restDBConfig = {
    'baseURL': 'https://euro2020-46ed.restdb.io/rest',
    'headers': {
        'Content-Type': 'application/json',
        'cache-Control': 'no-cache',
        'x-apikey': '501ae870617104ff948422ba8999c50ea308d',
    }
}
let axiosRestDBConfig = axios.create(restDBConfig)

clientDiscord.on("ready", () => {

    clientDiscord.user.setPresence({
        status: "online",
        activity: {
            name: "/help pour dans #bot plus d'infos",
            type: "PLAYING"
        }
    });

    let date = new Date().toJSON().slice(0, 19).replace(/-/g, '/');
    let dateFormat = date.split('T')[1] + " " + date.split('T')[0];

    clientDiscord.channels.cache.get(channelId.channel_log_id).send(embed.embedLog("Start", dateFormat));
})

clientDiscord.on('message', message => {
    let input = message.content.split(" ");
    let commande = input[0];

    if (message.channel.id === channelId.channel_log_id) {
        switch (commande) {
            case (prefix + "setup") :
                clientDiscord.channels.cache.get(channelId.channel_role_id).send(embed.embedRole)
                    .then(function (message) {
                        message.react(emojiId.emoji_bot_id);
                        message.react(emojiId.emoji_euro_id);
                        message.react(emojiId.emoji_musique_id);
                        message.react(emojiId.emoji_valorant_id);
                    });
                clientDiscord.channels.cache.get(channelId.channel_bot_id).send(embed.embedBotHelp);
                clientDiscord.channels.cache.get(channelId.channel_euro_id).send(embed.embedEuroHelp);
                clientDiscord.channels.cache.get(channelId.channel_musique_id).send(embed.embedMusiqueHelp);
                clientDiscord.channels.cache.get(channelId.channel_valorant_id).send(embed.embedValorantHelp);
                message.delete();

                clientDiscord.channels.cache.get(channelId.channel_log_id).send(embed.embedLog("Setup", "Setup"));
                break;
        }
    }

    //Bot
    if (message.channel.id === channelId.channel_bot_id) {
        switch (commande) {
            case (prefix + "vote") :
                let intitule = input.slice(1).join(" ");
                clientDiscord.channels.cache.get(channelId.channel_bot_id).send(embed.embedVote(intitule))
                    .then(function (message) {
                        message.react('✅');
                        message.react('❌');
                    });
                message.delete();
                break;

            case (prefix + "help") :
                clientDiscord.channels.cache.get(channelId.channel_euro_id).send(embed.embedBotHelp);
                message.delete();
                break;
        }
    }

    //Euro
    if (message.channel.id === channelId.channel_euro_id) {
        switch (commande) {
            case (prefix + "euro-bet") :
                let match = input.slice(1);
                let date = new Date().toJSON().slice(0, 19).replace(/-/g, '/');
                let dateFormat = date.split('T')[0] + " " + date.split('T')[1];

                let data = {
                    id_member: message.member.id,
                    pseudo_member: message.member.displayName,
                    match: match[0],
                    resultat: match[1],
                    score: match[2],
                    buteur: match[3],
                    date: dateFormat
                }

                axiosRestDBConfig.post('/prono', data)
                    .then(response => console.log(response))
                    .catch(error => console.log(error))
                message.delete();
                break;

            case (prefix + "euro-view-my-bet") :
                let id_member = '"' + message.member.id + '"';
                axiosRestDBConfig.get('/prono?q={"id_member":' + id_member + '}')
                    .then(response =>
                        response.data.forEach(function (match) {
                            let embed = new Discord.MessageEmbed()
                                .setColor("#0099ff")
                                .setTitle(match.match)
                                .addFields(
                                    {name: 'Vainqueur', value: match.resultat, inline: true},
                                    {name: 'Score', value: match.score, inline: true},
                                    {name: ' Buteur', value: match.buteur, inline: true}
                                )
                                .setTimestamp(match.date)
                            message.author.send(embed)
                        })
                    )
                    .catch(error => console.log(error))
                message.delete();
                break;

            case (prefix + "help") :
                clientDiscord.channels.cache.get(channelId.channel_euro_id).send(embed.embedEuroHelp);
                message.delete();
                break;
            default :
                message.delete();
        }
    }

    //Musique
    if (message.channel.id === channelId.channel_musique_id) {
        switch (commande) {
            case (prefix + "help") :
                clientDiscord.channels.cache.get(channelId.channel_musique_id).send(embed.embedMusiqueHelp);
                message.delete();
                break;
            case (prefix + "play") :
                let lien = message.content.split(" ");
                musique.execute(message, lien[1]);
                break;
            case (prefix + "search") :
                usetube.searchVideo(message.content.slice(8))
                    .then(tube => musique.execute(message, "https://www.youtube.com/watch?v=" + tube.videos[0].id));
                break;
            case (prefix + "skip") :
                musique.skip(message);
                break;
            case (prefix + "stop") :
                musique.stop(message);
                break;
            default :
                message.delete();
        }
    }

    //Valorant
    if (message.channel.id === channelId.channel_valorant_id) {
        switch (commande) {
            case (prefix + "help") :
                clientDiscord.channels.cache.get(channelId.channel_valorant_id).send(embed.embedValorantHelp);
                break;
            case (prefix + "create") :
                let data = {
                    member_id: message.member.id,
                    member_name: message.member.displayName,
                    elo: 0,
                    match: 0
                }
                axiosRestDBConfig.post('/valorant', data)
                    .then(response => console.log(response))
                    .catch(error => console.log(error))
                message.delete();
                break;
            case (prefix + "maj") :
                axiosRestDBConfig.get('/valorant?q={"member_id":"' + message.member.id + '"}')
                    .then(response => {
                            let data = {
                                elo: response.data[0].elo + ((parseInt(score[0]) * 2) - parseInt(score[1]) + parseInt(score[2])),
                                match: response.data[0].match + 1,
                            }
                            console.log(response)
                            axiosRestDBConfig.put('/valorant/' + response.data[0]._id, data)
                                .then(response => console.log(response))
                                .catch(error => console.log(error))
                            console.log(data)
                        }
                    )
                    .catch(error => console.log(error))
                message.delete();
                break;
            case (prefix + "ranking") :
                let table = "**Pseudo | Elo | Match Jouer**\n";
                axiosRestDBConfig.get('/valorant')
                    .then(response => {
                        response.data.forEach(function (result) {
                            table += result.member_name + " | " + result.elo + " | " + result.match + " | " + result.elo / result.match + "\n";
                        })
                        clientDiscord.channels.cache.get(channelId.channel_valorant_id).send(embed.embedValorantRanking(table))
                    })
                    .catch(error => console.log(error))
                message.delete();
                break;
            case (prefix + "reset") :
                axiosRestDBConfig.get('/valorant?q={"member_id":"' + message.member.id + '"}')
                    .then(response => {
                            let data = {
                                elo: 0,
                                match: 0,
                            }
                            console.log(response)
                            axiosRestDBConfig.put('/valorant/' + response.data[0]._id, data)
                                .then(response => console.log(response))
                                .catch(error => console.log(error))
                            console.log(data)
                        }
                    )
                    .catch(error => console.log(error))
                message.delete();
                break;
            default :
                message.delete();
        }
    }

    //Tickets
    if (message.channel.id === channelId.channel_tickets_id) {
        switch (commande) {
            case (prefix + "tickets") :
                let intitule = input.slice(1).join(" ");
                message.guild.channels.create("tikets " + message.member.displayName, {
                    type: "text",
                    permissionOverwrites: [
                        {
                            id: roleId.role_admin_id && message.member.id,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
                        }
                    ],
                }).then(channel => channel.setParent(categoryId.category_tickets_id))
                    .then(channel => clientDiscord.channels.cache.get(channel.id).send(intitule));
                message.delete();
                break;
            default :
                message.delete();
        }
    }
});

clientDiscord.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.message.channel.id === channelId.channel_role_id) {
        let {guild} = reaction.message;
        let role;
        let member = guild.members.cache.find(member => member.id === user.id);
        switch (reaction.emoji.id) {
            case (emojiId.emoji_euro_id) :
                role = reaction.message.guild.roles.cache.find(r => r.id === roleId.role_euro_id);
                member.roles.add(role);

                clientDiscord.channels.cache.get(channelId.channel_log_id).send(embed.embedLog("Ajout role Euro", member));
                break;
            case (emojiId.emoji_bot_id) :
                role = reaction.message.guild.roles.cache.find(r => r.id === roleId.role_bot_id);
                member.roles.add(role);

                clientDiscord.channels.cache.get(channelId.channel_log_id).send(embed.embedLog("Ajout role Bot", member));
                break;

            case (emojiId.emoji_musique_id) :
                role = reaction.message.guild.roles.cache.find(r => r.id === roleId.role_musique_id);
                member.roles.add(role);

                clientDiscord.channels.cache.get(channelId.channel_log_id).send(embed.embedLog("Ajout role Musique", member));
                break;

            case (emojiId.emoji_valorant_id) :
                role = reaction.message.guild.roles.cache.find(r => r.id === roleId.role_valorant_id);
                member.roles.add(role);

                clientDiscord.channels.cache.get(channelId.channel_log_id).send(embed.embedLog("Ajout role Valorant", member));
                break;

            case (emojiId.emoji_tickets_id) :
                role = reaction.message.guild.roles.cache.find(r => r.id === roleId.role_tickets_id);
                member.roles.add(role);

                clientDiscord.channels.cache.get(channelId.channel_log_id).send(embed.embedLog("Ajout role Tickets", member));
                break;
        }
    }
});

clientDiscord.on('messageReactionRemove', async (reaction, user) => {
    if (reaction.message.channel.id === channelId.channel_role_id) {
        let {guild} = reaction.message;
        let role;
        let member = guild.members.cache.find(member => member.id === user.id);
        switch (reaction.emoji.id) {
            case (emojiId.emoji_euro_id) :
                role = reaction.message.guild.roles.cache.find(r => r.id === roleId.role_euro_id);
                member.roles.remove(role);

                clientDiscord.channels.cache.get(channelId.channel_log_id).send(embed.embedLog("Remove role Euro", member));
                break;
            case (emojiId.emoji_bot_id) :
                role = reaction.message.guild.roles.cache.find(r => r.id === roleId.role_bot_id);
                member.roles.remove(role);

                clientDiscord.channels.cache.get(channelId.channel_log_id).send(embed.embedLog("Remove role Bot", member));
                break;

            case (emojiId.emoji_musique_id) :
                role = reaction.message.guild.roles.cache.find(r => r.id === roleId.role_musique_id);
                member.roles.remove(role);

                clientDiscord.channels.cache.get(channelId.channel_log_id).send(embed.embedLog("Remove role Musique", member));
                break;

            case (emojiId.emoji_valorant_id) :
                role = reaction.message.guild.roles.cache.find(r => r.id === roleId.role_valorant_id);
                member.roles.remove(role);

                clientDiscord.channels.cache.get(channelId.channel_log_id).send(embed.embedLog("Remove role Valorant", member));
                break;

            case (emojiId.emoji_tickets_id) :
                role = reaction.message.guild.roles.cache.find(r => r.id === roleId.role_tickets_id);
                member.roles.remove(role);

                clientDiscord.channels.cache.get(channelId.channel_log_id).send(embed.embedLog("Remove role Tickets", member));
                break;
        }
    }
});

clientDiscord.login(token);

