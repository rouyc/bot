const Discord = require('discord.js');

const {prefix, token, channel_id} = require("./config.json");

const clientDiscord = new Discord.Client();

clientDiscord.on('message', message => {
  if (message.channel.id === channel_id) {
    /*if (message.content === prefix + "serveurNom") { //Nom du serveur
      clientDiscord.channels.get("694260267885789215").send("Serveur de " + message.guild.name);
      clientDiscord.channels.get("694253678617427989").send("Commande serveurNom");
      message.delete();
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
    }*/
    if (message.content.startsWith(prefix + "vote")) { //Initier un vote
      let args = message.content.split(" ").slice(1);
      let intitule = args.join(" ");
      let embed = new Discord.RichEmbed()
          .addField(intitule, "Répondre avec :white_check_mark: ou :x:")
          .setColor("0xB40404")
          .setTimestamp();
      clientDiscord.channels.get(channel_id).send(embed) //Crée le vote dans le channel vote
          .then(function (message) {
            message.react('✅');
            message.react('❌');
          });
    }
    if(message.content.startsWith(prefix + "clean")){
      let args = message.content.split(" ").slice(1);
      let amount = parseInt(args[0])
      if (isNaN(amount) || amount <= 1 || amount >= 100) {
        return message.reply("Ce n'est pas un nombre valide, tu dois saisir un nombre compris entre 1 et 99  !");
      }
      clientDiscord.channels.get(channel_id).bulkDelete(amount-1);
      message.delete();
    }
    if (message.content === prefix + "help") {
      message.channel.send("```Commandes du bot :" +
          "\n - " + prefix + "help : Affiche toutes les commandes disponibles" +
          /*"\n - " + prefix + "serveurNom : Donne le nom du serveur" +
          "\n - " + prefix + "serveurMembre : Nombre de gens sur le serveur" +
          "\n - " + prefix + "serveurMembreConnecte : Nombre de gens connectés sur le serveur" +
          "\n - " + prefix + "serveurMembreDeconnecte : Nombre de gens deconnectés sur le serveur" +
          "\n - " + prefix + "photo : Envoie une photo" +*/
          "\n - " + prefix + "vote + intitulité : Propose un vote" +
          "\n - " + prefix + "clean : Supprime les X derniers messages" +
          "```");
    }
  }
});

clientDiscord.login(token);
