//GUILD_ID = 1103832500641464430
//CLIENT_ID = 1105888971449442374
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env') })
const { REST, Routes, ApplicationCommandOptionType } = require("discord.js");

const commands = [
  {
    name: "standings",
    description: "gets championship standings"
  },
  {
    name: "nextrace",
    description: "gets the next f1 race and start time"
  }
];

const rest = new REST().setToken(
  process.env.BOT_TOKEN
);

(async () => {
  try {
    console.log("registering slash commands...");
    await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: commands }
    );

    console.log("slash commands registered successfully");
  } catch (error) {
    console.log(error);
  }
})();
