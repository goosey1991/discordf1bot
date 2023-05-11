const path = require("path");
const axios = require("axios");

require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const { Client, IntentsBitField, EmbedBuilder } = require("discord.js");
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("ready", (c) => {
  console.log(`✅ ${c.user.tag} is online.`);
});

client.on("messageCreate", (msg) => {
  console.log(msg.content);

  if (msg.author.bot) {
    return;
  }

  if (msg.content === "hello") {
    msg.reply(
      "https://giphy.com/gifs/starwars-star-wars-episode-3-xTiIzJSKB4l7xTouE8"
    );
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "standings") {
    const getStandings = async () => {
      const response = await axios.get(
        "https://ergast.com/api/f1/current/driverStandings.json"
      );
      const resStandings =
        response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
      return resStandings;
    };

    const standingsValues = await getStandings();

    const standings = new EmbedBuilder()
      .setTitle("Latest F1 Standings")
      .setColor("Random");

    for (let i = 0; i < standingsValues.length; i++) {
      const currentFirstName = standingsValues[i].Driver.givenName;
      const currentLastName = standingsValues[i].Driver.familyName;
      const currentPoints = standingsValues[i].points;

      standings.addFields({
        name: `${currentPoints}`,
        value: `${currentFirstName} ${currentLastName}`,
      });
    }
    //.addFields({name: 'Field title', value: 'Some Value'})

    interaction.reply({ embeds: [standings] });
    //interaction.reply(`The person in ${pos1}st place is ${pos1FirstName} ${pos1LastName} with ${pos1Points} points`);
  }

  if (interaction.commandName === "nextrace") {
    const getRaces = async () => {
      const racesResponse = await axios.get(
        "https://ergast.com/api/f1/current.json"
      );
      const raceList = racesResponse.data.MRData.RaceTable.Races;
      return raceList;
    };

    const races = await getRaces();
    console.log(races);

    const date = new Date().getTime();

    for (let i = 0; i < races.length; i++) {
      const currentRaceDate = new Date(races[i].date);
      console.log(currentRaceDate);
      if (date <= currentRaceDate) {
        console.log("next race found!");
        const nextRaceName = races[i].raceName;
        const nextCircuitName = races[i].Circuit.circuitName;
        const nextRaceCountry = races[i].Circuit.Location.country;
        const nextRaceTime = races[i].time;
        const nextRaceDate = currentRaceDate.toLocaleDateString();

        interaction.reply(
          `The next race is the ${nextRaceName} in ${nextRaceCountry} at the ${nextCircuitName} on ${nextRaceDate}. 🔴 🟢 🏎️  LIGHTS OUT at ${nextRaceTime} (BST -1)  🏎️ 🟢 🔴`
        );
        break;
      }
    } 

  }
  //.addFields({name: 'Field title', value: 'Some Value'})
});

client.login(process.env.BOT_TOKEN);
