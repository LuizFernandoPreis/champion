const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const axios = require("axios");

const config = {
  token:
    "MTI3NTk0MjMzMTYxODQzMTA0OQ.GYSg6M.MX42RJyqut7qEcajJDJ5H7sDKfR59kaTG-9xsY",
  clientId: "1275942331618431049",
};

const getFormattedDate = () => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();

  return `${day}/${month}`;
};

const client = new Client({
  intents: [GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds],
});

async function creativeTimer() {
  let data = getFormattedDate();
  try {
    const channel = await client.channels.fetch("1004519188209086467");
    const apiUrl = `http://localhost:1337/?filterValue=${data}`;

    const response = await axios.get(apiUrl);

    if (response.data && response.data.length > 0) {
      const embed = new EmbedBuilder()
        .setTitle("🚨Prioridades do dia!🚨")
        .setColor("#0099ff")
        .setTimestamp();

      response.data.forEach((row) => {
        embed.addFields({
          name: `Nome: ${row[0]}`,
          value: `WhatsApp: [Link](https://wa.me/${row[1]})
          Data: ${row[2]}
          Status: ${row[8]}
          Documento: [Link](${row[6]})
          Responsável: ${row[7]}
          Link do Drive: [Link](${row[9]})
          Criativos: ${row[10]}`,
          inline: false,
        });
        console.log(row[7]);
      });

      await channel.send({ embeds: [embed] });
    } else {
      channel.send("No data found.");
    }
  } catch (error) {
    console.error("Error fetching data or sending message:", error);
    const channel = await client.channels.fetch("1004519188209086467");
    channel.send("An error occurred while fetching data.");
  }
}

client.once("ready", async () => {
  console.log("Bot is ready!");
  creativeTimer();
  setInterval(() => {
    creativeTimer();
  }, 43200000);
});

client.login(config.token);
