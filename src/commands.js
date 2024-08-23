const { REST, Routes } = require("discord.js");

const commands = [
  {
    name: "ping",
    description: "Responde com pong",
  },
];

function registerCommands(clientId, token) {
  const rest = new REST({ version: "10" }).setToken(token);

  (async () => {
    try {
      console.log("Registrando comandos de barra...");

      await rest.put(Routes.applicationCommands(clientId), { body: commands });

      console.log("Comandos registrados com sucesso!");
    } catch (error) {
      console.error("Erro ao registrar comandos:", error);
    }
  })();
}

module.exports = { registerCommands };
