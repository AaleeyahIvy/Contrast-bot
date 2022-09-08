require("dotenv").config();
const { Client, Routes, Collection, GatewayIntentBits, Partials } = require("discord.js");
const { REST } = require('@discordjs/rest');
// We also load the rest of the things we need in this file:
const { readdirSync } = require("fs");
const { permLevels } = require("./config.js");
const logger = require("./modules/logger.js");
// This is your client. Some people call it `bot`, some people call it `self`,
// some might call it `cootchie`. Either way, when you see `client.something`,
// or `bot.something`, this is what we're referring to. Your client.
const client = new Client({ intents:[GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers,], partials: [Partials.Channel] });

const clientId = '1016718682992418847';
const guildId = '591686553038749710';
// Aliases, commands and slash commands are put in collections where they can be
// read from, catalogued, listed, etc.
const commands = new Collection();
const aliases = new Collection();
const slashcmds = new Collection();

// Generate a cache of client permissions for pretty perm names in commands.
const levelCache = {};
for (let i = 0; i < permLevels.length; i++) {
  const thisLevel = permLevels[i];
  levelCache[thisLevel.name] = thisLevel.level;
}

// To reduce client pollution we'll create a single container property
// that we can attach everything we need to.
client.container = {
  commands,
  aliases,
  slashcmds,
  levelCache
};
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

// We're doing real fancy node 8 async/await stuff here, and to do that
// we need to wrap stuff in an anonymous function. It's annoying but it works.

const init = async () => {

  // Here we load **commands** into memory, as a collection, so they're accessible
  // here and everywhere else.
  const commands = readdirSync("./commands/").filter(file => file.endsWith(".js"));
  for (const file of commands) {
    const props = require(`./commands/${file}`);
    logger.log(`Loading Command: ${props.help.name}.`, "log");
    client.container.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.container.aliases.set(alias, props.help.name);
    });
  }

  // Now we load any **slash** commands you may have in the ./slash directory.
  const slashCommands = [];
  const slashFiles = readdirSync("./slash").filter(file => file.endsWith(".js"));
  for (const file of slashFiles) {
    const command = require(`./slash/${file}`);
    slashCommands.push(command.data.toJSON());
    const commandName = file.split(".")[0];
    logger.log(`Loading Slash command: ${commandName}.`, "log");
  
    // Now set the name of the command with it's properties.
    client.container.slashcmds.set(command.data, command);
  }

  (async () => {
    try {
      console.log(`Started refreshing ${slashFiles.length} application (/) commands.`);
  
      const data = await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: slashCommands },
      );
  
      console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
      console.error(error);
    }
  })();

  // Then we load events, which will include our message and ready event.
  const eventFiles = readdirSync("./events/").filter(file => file.endsWith(".js"));
  for (const file of eventFiles) {
    const eventName = file.split(".")[0];
    logger.log(`Loading Event: ${eventName}.`, "log");
    const event = require(`./events/${file}`);
    // Bind the client to any event, before the existing arguments
    // provided by the discord.js event. 
    // This line is awesome by the way. Just sayin'.
    client.on(eventName, event.bind(null, client));
  }  

  // Threads are currently in BETA.
  // This event will fire when a thread is created, if you want to expand
  // the logic, throw this in it's own event file like the rest.
  client.on("threadCreate", (thread) => thread.join());

  // Here we login the client.
  client.login(process.env.DISCORD_TOKEN);

// End top-level async/await function.
};

init();