const Discord = require('discord.js');

const {prefix, channel_id, startToken, midToken, endToken} = require("./config.json");

const token = startToken + midToken + endToken;

const clientDiscord = new Discord.Client();

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
    console.log(commande);
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
});

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
