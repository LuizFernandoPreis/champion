const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const axios = require("axios");
require("dotenv").config();

const token = process.env.TOKEN;
const config = {
  token: token,
  clientId: "1275942331618431049",
};

const getFormattedDate = () => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
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
    const apiUrl = `http://92.113.34.132:1337/?filterValue=${data}`;

    const response = await axios.get(apiUrl);
    console.log(response.data);
    if (response.data && response.data.length > 0) {
      const embed = new EmbedBuilder()
        .setTitle("🚨Prioridades do dia!🚨")
        .setColor("#0099ff")
        .setTimestamp();

      response.data.forEach((row) => {
        embed.addFields({
          name: `Nome: ${row[0]}`,
          value: `WhatsApp: [Link](https://wa.me/${row[2]})
          Data: ${row[3]}
          Status copy: ${row[6]}
          Status edição: ${row[9]}
          Documento: [Link](${row[7]})
          Responsável: ${row[5]}
          Criativos: ${row[10]}`,
          inline: false,
        });
        console.log(row[7]);
      });

      await channel.send({ embeds: [embed] });
    } else {
    }
  } catch (error) {
    console.error("Error fetching data or sending message:", error);
    const channel = await client.channels.fetch("1004519188209086467");
    channel.send("An error occurred while fetching data.");
  }
}

async function onUpdate() {
  const channel = await client.channels.fetch("1004519188209086467");
  const apiUrl = `http://92.113.34.132:1337/pronto`;
  const response = await axios.get(apiUrl);

  if (response.data && response.data.length > 0) {
    const embed = new EmbedBuilder()

      .setTitle("🚨Atualização!🚨")
      .setColor("#0099ff")
      .setTimestamp();

    response.data.forEach((row) => {
      if (row[9] == "Pronto") {
        embed.setTitle("🚨Pronto para Envio!🚨");
        console.log("entrou");
      }

      embed.addFields({
        name: `Cliente: ${row[0]}`,
        value: `Status de edição: "${row[9]}"
        Status da copy: "${row[6]}"
      Copy: ${row[11]}
      Prazo: ${row[3]}
      Entrega Rápida: ${row[4]}`,
        inline: false,
      });
      console.log(row[7]);
    });

    await channel.send({ embeds: [embed] });
  } else {
  }
}

client.once("ready", async () => {
  console.log("Bot is ready!");
  creativeTimer();

  // Intervalo diário
  setInterval(() => {
    creativeTimer();
  }, 43200000);

  // verifica atualização
  setInterval(() => {
    onUpdate();
  }, 10000);
});

client.login(config.token);
