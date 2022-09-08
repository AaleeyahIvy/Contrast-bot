const { EmbedBuilder } = require('discord.js');
exports.run = (client, message, args)=>{
  const user = message.mentions.users.first() || message.author;
  const avatarEmbed = new EmbedBuilder
      .setColor(0x333333)
      .setAuthor(user.username)
      .setImage(user.avatarURL);
      channel.send({ embeds: [avatarEmbed] });
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