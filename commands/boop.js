exports.run = (client, message, args)=>{
    message.reply(`Booping ${message.mentions.members.first()} on the nose!`)
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["b", "boop"],
    permLevel: "User"
  };
  
  exports.help = {
    name: "boop",
    category: "Fun",
    description: "Boops a user",
    usage: "> boop@user"
  };