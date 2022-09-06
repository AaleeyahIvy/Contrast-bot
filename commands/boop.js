exports.run = (client, message, args)=>{
    message.channel.send(`Booping ${user.username} on the nose!`)
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
    usage: "<C boop @user"
  };