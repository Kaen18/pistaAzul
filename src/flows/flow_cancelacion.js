const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
} = require("@bot-whatsapp/bot");

const mainCancelacion = addKeyword([
  "Cancelar reserva",
  "cancelar canchas",
  "cancelar",
]).addAnswer(["Esta en el flujo de cancelacion", "dev by Kaen"]);

module.exports = { mainCancelacion };
