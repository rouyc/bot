const Discord = require('discord.js');
const axios = require('axios')
const {prefix, channel_id,channel_role_id, channel_euro_id, role_euro_id, emoji_euro_id, startToken, midToken, endToken} = require("./config.json");
const token = startToken + midToken + endToken;
const clientDiscord = new Discord.Client();
const restDBConfig = {
  'baseURL': 'https://euro2020-46ed.restdb.io/rest/',
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
      break;
      case ('/help') :
        clientDiscord.channels.cache.get(channel_id).send("```Commandes du bot :" +
            "\n - " + prefix + "help : Affiche toutes les commandes disponibles" +
            "\n - " + prefix + "euro : Pour faire un pronostic sur un match de l'Euro (Rôle Euro nécessaire)" +
            /*"\n - " + prefix + "serveurNom : Donne le nom du serveur" +
            "\n - " + prefix + "serveurMembre : Nombre de gens sur le serveur" +
            "\n - " + prefix + "serveurMembreConnecte : Nombre de gens connectés sur le serveur" +
            "\n - " + prefix + "serveurMembreDeconnecte : Nombre de gens deconnectés sur le serveur" +
            "\n - " + prefix + "photo : Envoie une photo" +*/
            "\n - " + prefix + "vote + intitulité : Propose un vote" +
            "```");
      break;
    }
  }
  if (message.channel.id === channel_euro_id) {
    let input = message.content.split(" ");
    let commande = input[0];
    switch(commande){
      case ("/euro") :
        let match = input.slice(1);
        let resultat = match[1] + " " + match[2];
        let date = new Date().toJSON().slice(0,19).replace(/-/g,'/');
        let dateFormat = date.split('T')[0] + " " + date.split('T')[1];

        const data = {
          id_player: message.member.id,
          match: match[0],
          resultat: resultat,
          date : dateFormat
        }

        axiosRestDBConfig.post('/prono', data)
            .then(response => console.log(response))
            .catch(error => console.log(error))
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
      if (reaction.emoji.id === emoji_euro_id) { //if the user reacted with the right emoji
        const role = reaction.message.guild.roles.cache.find(r => r.id === role_euro_id); //finds role you want to assign (you could also user .name instead of .id)
        const {guild} = reaction.message //store the guild of the reaction in variable
        const member = guild.members.cache.find(member => member.id === user.id); //find the member who reacted (because user and member are seperate things)
        member.roles.add(role); //assign selected role to member
      }
    }
  }
})

/*clientDiscord.on('message', message => {
  if (message.channel.id === channel_id) {
    if (message.content === prefix + "serveurNom") { //Nom du serveur
      message.reply("Serveur " + message.guild.name);
    }
    if (message.content === prefix + "serveurMembre") { //Nombre de membre sur le serveur
      clientDiscord.channels.get("694260267885789215").send("Il y a actuellement " + message.guild.memberCount + " membres");
      clientDiscord.channels.get("694253678617427989").send("Commande serveurMembre");
      message.delete();
    }
    if (message.content === prefix + "serveurMembreConnecte") { //Nombre de membre connecte sur le serveur
      clientDiscord.channels.get("694260267885789215").send("Il y a actuellement " + message.guild.members.filter(({presence}) => presence.status !== 'offline').size + " membre(s) connecté(s)");
      clientDiscord.channels.get("694253678617427989").send("Commande serveurMembreConnectes");
      message.delete();
    }
    if (message.content === prefix + "serveurMembreDeconnecte") { //Nombre de membre deconnecte sur le serveur
      clientDiscord.channels.get("694260267885789215").send("Il y a actuellement " + message.guild.members.filter(({presence}) => presence.status == 'offline').size + " membre(s) déconnecté(s)");
      clientDiscord.channels.get("694253678617427989").send("Commande serveurMembreDeconnectes");
      message.delete();
    }
    if (message.content === prefix + "photo") { //Envoyer une photo
      clientDiscord.channels.get(channel_id).send("Bip Bip Boup", {files: ["./images/robot.png"]});
    }
    if (message.content.startsWith(prefix + "vote")) { //Initier un vote
      let args = message.content.split(" ").slice(1);
      let intitule = args.join(" ");
      let embed = new Discord.MessageEmbed()
          .addField(intitule, "Répondre avec :white_check_mark: ou :x:")
          .setColor("0xB40404")
          .setTimestamp();
      message.reply(embed) //Crée le vote dans le channel vote
          .then(function (message) {
            message.react('✅');
            message.react('❌');
          });
    }
    if (message.content === prefix + "help") {
      clientDiscord.channels.cache.get(channel_id).send("```Commandes du bot :" +
          "\n - " + prefix + "help : Affiche toutes les commandes disponibles" +
          /!*"\n - " + prefix + "serveurNom : Donne le nom du serveur" +
           "\n - " + prefix + "serveurMembre : Nombre de gens sur le serveur" +
           "\n - " + prefix + "serveurMembreConnecte : Nombre de gens connectés sur le serveur" +
           "\n - " + prefix + "serveurMembreDeconnecte : Nombre de gens deconnectés sur le serveur" +
           "\n - " + prefix + "photo : Envoie une photo" +*!/
          "\n - " + prefix + "vote + intitulité : Propose un vote" +
          "```");
      }
  }
});*/

clientDiscord.login(token);
