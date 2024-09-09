const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const axios = require("axios");
require("dotenv").config();

//----------------------//
// CONFIGURAÇÕES DO BOT //
//----------------------//
const token = process.env.TOKEN;
const config = {
  token: token,
  clientId: "1275942331618431049",
};

const canalProducao = "1280353921826553927";
const canalTeste = "1004519188209086467";

//------------------------------------//
// DEVOLVE DATA NO FORMATO NECESSÁRIO //
//------------------------------------//
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

//--------------------------------------//
// FUNÇÃO QUE RETORNA INDEX DAS COLUNAS //
//--------------------------------------//
async function getColunas() {
  let colunas = await axios.get("http://localhost:1337/colunas");
  colunas = colunas.data;

  const cliente = colunas["Cliente"] - 1;
  const num = colunas["Número cliente"] - 1;
  const copyStatus = colunas["Copy Status"] - 1;
  const editStatus = colunas["Edição Status"] - 1;
  const linkCopy = colunas["Link Da Copy"] - 1;
  const criativos = colunas["Criativos"] - 1;
  const linkCriativo = colunas["Link Dos criativos"] - 1;
  const copywriter = colunas["Copywriter"] - 1;
  const editor = colunas["Editor"] - 1;
  const prazo = colunas["Prazo"] - 1;
  const entrega = colunas["Entrega"] - 1;

  return {
    cliente,
    num,
    copyStatus,
    editStatus,
    linkCopy,
    criativos,
    linkCriativo,
    copywriter,
    editor,
    prazo,
    entrega,
  };
}

//--------------------------------//
// AÇÃO EXECUTADA A CADA 12 HORAS //
//--------------------------------//
async function creativeTimer() {
  let data = getFormattedDate();
  try {
    const channel = await client.channels.fetch(canalProducao);
    const apiUrl = `http://localhost:1337/?filterValue=${data}`;

    const response = await axios.get(apiUrl);

    const {
      cliente,
      num,
      prazo,
      copyStatus,
      editStatus,
      linkCopy,
      copywriter,
      criativos,
    } = await getColunas();

    console.log(num);
    if (response.data && response.data.length > 0) {
      const embed = new EmbedBuilder()
        .setTitle("🚨Prioridades do dia!🚨")
        .setColor("#0099ff")
        .setTimestamp();

      response.data.forEach((row) => {
        embed.addFields({
          name: `Nome: ${row[cliente]}`,
          value: `WhatsApp: [Link](https://wa.me/${row[num]})
          Data: ${row[prazo]}
          Status copy: ${row[copyStatus]}
          Status edição: ${row[editStatus]}
          Documento: [Link](${row[linkCopy]})
          Responsável: ${row[copywriter]}
          Criativos: ${row[criativos]}`,
          inline: false,
        });
      });

      await channel.send({ embeds: [embed] });
    } else {
    }
  } catch (error) {
    console.error("Error fetching data or sending message:", error);
    const channel = await client.channels.fetch(canalProducao);
    channel.send("An error occurred while fetching data.");
  }
}

//-----------------------------------//
// AÇÃO EXECUTADA A CADA 10 SEGUNDOS //
//-----------------------------------//
async function onUpdate() {
  const channel = await client.channels.fetch(canalProducao);
  const apiUrl = `http://localhost:1337`;
  const response = await axios.get(apiUrl + "/pronto");

  const {
    cliente,
    num,
    prazo,
    copyStatus,
    editStatus,
    entrega,
    criativos,
  } = await getColunas();

  console.log(editStatus)

  if (response.data && response.data.length > 0) {
    const embed = new EmbedBuilder()

      .setTitle("🚨Atualização!🚨")
      .setColor("#0099ff")
      .setTimestamp();

    response.data.forEach((row) => {
      if (row[editStatus] == "Pronto") {
        embed.setTitle("🚨Pronto para Envio!🚨");
      }

      embed.addFields({
        name: `Cliente: ${row[cliente]}`,
        value: `Status de edição: "${row[editStatus]}"
        Status da copy: "${row[copyStatus]}"
      Copy: ${row[criativos]}
      Prazo: ${row[prazo]}
      Entrega Rápida: ${row[entrega]}`,
        inline: false,
      });
    });

    await channel.send({ embeds: [embed] });
  } else {
  }
}

//-------------------------------//
// AÇÕES DO BOT DURANTE EXECUÇÃO //
//-------------------------------//

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

// Loga o bot
client.login(config.token);
