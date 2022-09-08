exports.run = (client, message, args)=>{
    message.reply(`Booping ${message.mentions.members.first()} on the nose!`)
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["A", "myAvatar"],
    permLevel: "User"
  };
  
  exports.help = {
    name: "avatar",
    category: "Fun",
    description: "Shows user's avatar",
    usage: ">Avatar@user"
  };