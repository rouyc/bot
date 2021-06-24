let Discord = require('discord.js');

let axios = require('axios');

let {
    prefix,
    startToken,
    midToken,
    endToken
} = require("./config/config.json");

let {
    channel_bot_id,
    channel_role_id,
    channel_euro_id
} = require("./config/channel_id.json");

let {
    role_bot_id,
    role_euro_id
} = require("./config/role_id.json");

let {
    emoji_bot_id,
    emoji_euro_id
} = require("./config/emoji_id.json");

const embed = require('./embed.js')

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
    console.log("Ready")
    clientDiscord.user.setPresence({
        status: "online",
        activity: {
            name: "/help pour plus d'info",
            type: "PLAYING"
        }
    });

    clientDiscord.channels.cache.get(channel_role_id).send(embed.embedRole)
        .then(function (message) {
            message.react(emoji_bot_id);
            message.react(emoji_euro_id);
        });

    clientDiscord.channels.cache.get(channel_bot_id).send(embed.embedBotHelp);

    clientDiscord.channels.cache.get(channel_euro_id).send(embed.embedEuroHelp);

})

clientDiscord.on('message', message => {
    if (message.channel.id === channel_bot_id) {
        let input = message.content.split(" ");
        let commande = input[0];
        switch (commande) {
            case (prefix + "vote") :
                let intitule = input.slice(1).join(" ");
                let embed = new Discord.MessageEmbed()
                    .addField(intitule, "Répondre avec :white_check_mark: ou :x:")
                    .setColor("#0099ff")
                    .setTimestamp();
                clientDiscord.channels.cache.get(channel_bot_id).send(embed)
                    .then(function (message) {
                        message.react('✅');
                        message.react('❌');
                    });
                message.delete();
                break;
            case (prefix + "help") :
                clientDiscord.channels.cache.get(channel_bot_id).send(embedBotHelp);
                message.delete();
                break;
        }
    }
    if (message.channel.id === channel_euro_id) {
        let input = message.content.split(" ");
        let commande = input[0];
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
                clientDiscord.channels.cache.get(channel_euro_id).send(embedEuroHelp);
                message.delete();
                break;
        }
    }
});

clientDiscord.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.message.channel.id === channel_role_id) {
        let {guild} = reaction.message;
        let role;
        let member = guild.members.cache.find(member => member.id === user.id);
        switch (reaction.emoji.id) {
            case (emoji_euro_id) :
                role = reaction.message.guild.roles.cache.find(r => r.id === role_euro_id);
                member.roles.add(role);
                break;
            case (emoji_bot_id) :
                role = reaction.message.guild.roles.cache.find(r => r.id === role_bot_id);
                member.roles.add(role);
                break;
            default:
                reaction.remove();
        }
    }
});

clientDiscord.on('messageReactionRemove', async (reaction, user) => {
    if (reaction.message.channel.id === channel_role_id) {
        let {guild} = reaction.message;
        let role;
        let member = guild.members.cache.find(member => member.id === user.id);
        switch (reaction.emoji.id) {
            case (emoji_euro_id) :
                role = reaction.message.guild.roles.cache.find(r => r.id === role_euro_id);
                member.roles.remove(role);
                break;
            case (emoji_bot_id) :
                role = reaction.message.guild.roles.cache.find(r => r.id === role_bot_id);
                member.roles.remove(role);
                break;
            default:
                reaction.remove();
        }
    }
});

clientDiscord.login(token);
