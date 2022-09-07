exports.run = (channel, message, args)=>{
    channel.send(`Booping ${message.mentions.members.first()} on the nose!`)
}
exports.name = "boop";
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
    usage: "<C boop@user"
  };