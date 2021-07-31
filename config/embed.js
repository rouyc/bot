const Discord = require("discord.js");
const imgServ = "https://images-ext-1.discordapp.net/external/WyoC9jn8n_xGdxgnQjFgbTrEH6hepiip6fr6NzDQAOE/https/cdn.discordapp.com/icons/597370759119372288/a_eba406524f2430960ea3816fe8dd7c8e.webp";
const color = "#0099ff";

let {
    prefix
} = require("./config.json");

let embedBotHelp = new Discord.MessageEmbed()
    .setColor(color)
    .setTitle("Commandes du bot")
    .setThumbnail(imgServ)
    .setDescription("\n" + prefix + "help : Affiche toutes les commandes disponibles" +
        "\n" + prefix + "vote + intitulité : Propose un vote")

let embedRole = new Discord.MessageEmbed()
    .setColor(color)
    .setTitle("Choix des rôles")
    .setThumbnail(imgServ)
    .setDescription("Avant d'accéder aux salons, je t'invite à réagir à ce message pour avoir un rôle" +
        "\n <a:bot:857310806513418250> : Pour obtenir le rôle Bot et accéder au reste du serveur" +
        "\n <:euro2020:856854074144981002> : Pour obtenir le rôle Euro et faires des pronos sur l'Euro 2020" +
        "\n <:musique:870977864667922453> : Pour obtenir le rôle Musique et jouer de la musique dans les salons vocaux")

let embedEuroHelp = new Discord.MessageEmbed()
    .setColor(color)
    .setTitle("Commandes du bot")
    .setThumbnail(imgServ)
    .setDescription("\n" + prefix + "help : Affiche toutes les commandes disponibles" +
        "\n" + prefix + "euro-bet : Pour établir un prono sur l'Euro respecter la mise en forme : /euro-bet France-Belgique France 1-0(Facultatif) Umtiti(Facultatif)" +
        "\n" + prefix + "euro-view-my-bet : Pour voir ses pronos")

function embedVote(a) {
    return new Discord.MessageEmbed()
        .setColor(color)
        .setTitle(a)
        .setDescription("Répondre avec :white_check_mark: ou :x:")
}

function embedLog(a, b) {
    return new Discord.MessageEmbed()
        .setColor(color)
        .setTitle(a)
        .setDescription(b);
}

module.exports = {
    embedBotHelp: embedBotHelp,
    embedRole: embedRole,
    embedEuroHelp: embedEuroHelp,
    embedVote: embedVote,
    embedLog: embedLog
}