const Discord = require('discord.js');
const axios = require('axios')
const {prefix, channel_id,channel_role_id, channel_euro_id, role_euro_id, emoji_euro_id, startToken, midToken, endToken} = require("./config.json");
const token = startToken + midToken + endToken;
const clientDiscord = new Discord.Client();
const restDBConfig = {
  'baseURL': 'https://euro2020-46ed.restdb.io/rest',
  'headers': {
    'Content-Type': 'application/json',
    'cache-Control': 'no-cache',
    'x-apikey': '501ae870617104ff948422ba8999c50ea308d',
  }
}
const axiosRestDBConfig = axios.create(restDBConfig)

clientDiscord.on("ready", () => {
  console.log("Ready")
  clientDiscord.user.setPresence({
    status: "online",
    activity: {
      name: "/help pour plus d'info",
      type: "PLAYING"
    }
  });
})

clientDiscord.on('message', message => {
  if (message.channel.id === channel_id) {
    let input = message.content.split(" ");
    let commande = input[0];
    switch(commande){
      case ("/vote") :
        let intitule = input.slice(1).join(" ");
        let embed = new Discord.MessageEmbed()
            .addField(intitule, "Répondre avec :white_check_mark: ou :x:")
            .setColor("0xB40404")
            .setTimestamp();
        clientDiscord.channels.cache.get(channel_id).send(embed)
            .then(function (message) {
              message.react('✅');
              message.react('❌');
            });
        message.delete();
      break;
      case ('/help') :
        clientDiscord.channels.cache.get(channel_id).send(">>> Commandes du bot :" +
            "\n - " + prefix + "help : Affiche toutes les commandes disponibles" +
            "\n - " + prefix + "vote + intitulité : Propose un vote");
        message.delete();
        break;
    }
  }
  if (message.channel.id === channel_role_id) {
    let input = message.content.split(" ");
    let commande = input[0];
    switch(commande){
      case ("/set") :
        clientDiscord.channels.cache.get(channel_role_id).send(">>> Pour obtenir le rôle souhaité réagissez avec l'émoji associé :" +
            "\n - <:euro2020:856854074144981002> Pour obtenir le rôle Euro et faire des pronos sur l'Euro")
            .then(function (message) {
              message.react('856854074144981002');
            });
        message.delete();
        break;
    }
  }
  if (message.channel.id === channel_euro_id) {
    let input = message.content.split(" ");
    let commande = input[0];
    switch(commande){
      case ("/euro-bet") :
        let match = input.slice(1);
        let date = new Date().toJSON().slice(0,19).replace(/-/g,'/');
        let dateFormat = date.split('T')[0] + " " + date.split('T')[1];

        const data = {
          id_member: message.member.id,
          pseudo_member: message.member.displayName,
          match: match[0],
          resultat: match[1],
          score : match[2],
          buteur : match[3],
          date : dateFormat
        }

        axiosRestDBConfig.post('/prono', data)
            .then(response => console.log(response))
            .catch(error => console.log(error))
        message.delete();
        break;
      case ("/euro-view-my-bet") :
        let id_member = '"' + message.member.id + '"';
        axiosRestDBConfig.get('/prono?q={"id_member":' + id_member + '}')
            .then(response =>
                response.data.forEach(function(match) {
                  console.log(match);
                  let embed = new Discord.MessageEmbed()
                      .setColor("#0099ff")
                      .setTitle(match.match)
                      .addFields(
                          { name: 'Vainqueur', value: match.resultat, inline: true },
                          { name: 'Score', value: match.score, inline: true },
                          { name: ' Buteur', value: match.buteur, inline: true }
                      )
                      .setTimestamp(match.date)
                  message.author.send(embed)
                })
            )
            .catch(error => console.log(error))
        message.delete();
        break;
      case ('/help') :
        clientDiscord.channels.cache.get(channel_euro_id).send(">>> Commandes du bot :" +
            "\n - " + prefix + "help : Affiche toutes les commandes disponibles" +
            "\n - " + prefix + "euro-bet : Pour établir un prono sur l'Euro respecter la mise en forme : /euro-bet France-Belgique France 1-0(Facultatif) Umtiti(Facultatif)" +
            "\n - " + prefix + "euro-view-my-bet : Pour voir ses pronos faits");
        message.delete();
        break;
    }
  }
});

clientDiscord.on('messageReactionAdd', async (reaction, user) => {
  if (reaction.message.channel.id === channel_role_id) {
    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (error) {
        console.error('Fetching message failed: ', error);
        return;
      }
    }
    if (!user.bot) {
      //Give Euro Role
      if (reaction.emoji.id === emoji_euro_id) { //si le user a réagis avec le bon emoji
        const role = reaction.message.guild.roles.cache.find(r => r.id === role_euro_id); //chercher le role a ajouter
        const {guild} = reaction.message //stocke le guild dans une variable
        const member = guild.members.cache.find(member => member.id === user.id); //cherche le membre a qui on doit ajouter le rôle
        member.roles.add(role); //assigne le role aux membres
      }
    }
  }
})

clientDiscord.login(token);
