const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
} = require("@bot-whatsapp/bot");
require("dotenv").config()

const MetaProvider = require("@bot-whatsapp/provider/meta");
const MySQLAdapter = require("@bot-whatsapp/database/mysql");
const { mainConsultas } = require("./src/flows/flow_consulta");
const {
  mainReservas,
  flowCanchaFirst,
  flowCanchaSecond,
  nodoPresentarDias,
  nodoPresentarHoras,
  nodoMasHorarios,
  nodeInicioDatosClientes,
  nodoObtenerCorreo,
  nodoFinalizarReserva,
  nodeObtenerCI,
} = require("./src/flows/flow_reserva");
const { mainCancelacion } = require("./src/flows/flow_cancelacion");

/**
 * Declaramos las conexiones de MySQL
 *
 * TODO: Crear conexion al servidor ✅
 * TODO: Pasar claves sensibles a un .env ✅
 * TODO: Crear control de .env para no queden vacios las claves
 */

const MYSQL_DB_HOST = process.env.MYSQL_DB_HOST;
const MYSQL_DB_USER = process.env.MYSQL_DB_USER;
const MYSQL_DB_PASSWORD = process.env.MYSQL_DB_PASSWORD;
const MYSQL_DB_NAME = process.env.MYSQL_DB_NAME;
const MYSQL_DB_PORT = process.env.MYSQL_DB_PORT;

console.log(`[MAIN] MYSQL_DB_HOST: ${MYSQL_DB_HOST} MYSQL_DB_USER: ${MYSQL_DB_USER} MYSQL_DB_PASSWORD: ${MYSQL_DB_PASSWORD} MYSQL_DB_NAME: ${MYSQL_DB_NAME} MYSQL_DB_PORT: ${MYSQL_DB_PORT}`)

const flowSecundario = addKeyword(["2", "siguiente"]).addAnswer([
  "📄 Aquí tenemos el flujo secundario",
]);

const flowDocs = addKeyword([
  "doc",
  "documentacion",
  "documentación",
]).addAnswer(
  [
    "📄 Aquí encontras las documentación recuerda que puedes mejorarla",
    "https://bot-whatsapp.netlify.app/",
    "\n*2* Para siguiente paso.",
  ],
  null,
  null,
  [flowSecundario]
);

const flowTuto = addKeyword(["tutorial", "tuto"]).addAnswer(
  [
    "🙌 Aquí encontras un ejemplo rapido",
    "https://bot-whatsapp.netlify.app/docs/example/",
    "\n*2* Para siguiente paso.",
  ],
  null,
  null,
  [flowSecundario]
);

const flowGracias = addKeyword(["gracias", "grac"]).addAnswer(
  [
    "🚀 Puedes aportar tu granito de arena a este proyecto",
    "[*opencollective*] https://opencollective.com/bot-whatsapp",
    "[*buymeacoffee*] https://www.buymeacoffee.com/leifermendez",
    "[*patreon*] https://www.patreon.com/leifermendez",
    "\n*2* Para siguiente paso.",
  ],
  null,
  null,
  [flowSecundario]
);

const flowDiscord = addKeyword(["discord"]).addAnswer(
  [
    "🤪 Únete al discord",
    "https://link.codigoencasa.com/DISCORD",
    "\n*2* Para siguiente paso.",
  ],
  null,
  null,
  [flowSecundario]
);

const flowPrincipal = addKeyword(["hola", "ole", "alo"])
  .addAnswer("🙌 Hola bienvenido a *Pista Azul*⚽")
  .addAnswer(
    "Selecciona la accion que desea realizar",
    {
      capture: true,
      buttons: [
        { body: "Consultar reservas" },
        { body: "Reservar cancha" },
        { body: "Cancelar reserva" },
      ],
    },
    async (ctx, { flowDynamic, gotoFlow }) => {
      console.log(ctx.body);

      if (ctx.body === "Consultar reservas") await gotoFlow(mainConsultas);
      if (ctx.body === "Reservar cancha") await gotoFlow(mainReservas);
      if (ctx.body === "Cancelar reserva") await gotoFlow(mainCancelacion);
    }
  );

const main = async () => {
  const adapterDB = new MySQLAdapter({
    host: MYSQL_DB_HOST,
    user: MYSQL_DB_USER,
    database: MYSQL_DB_NAME,
    password: MYSQL_DB_PASSWORD,
    port: MYSQL_DB_PORT,
  });
  const adapterFlow = createFlow([
    flowPrincipal,
    mainConsultas,
    mainCancelacion,
    mainReservas,
    flowCanchaFirst,
    flowCanchaSecond,
    nodoPresentarDias,
    nodoPresentarHoras,
    nodoMasHorarios,
    nodeInicioDatosClientes,
    nodeObtenerCI,
    nodoObtenerCorreo,
    nodoFinalizarReserva,
  ]);

  const adapterProvider = createProvider(MetaProvider, {
    jwtToken:process.env.JWTOKEN,
    numberId: process.env.NUMBERID,
    verifyToken: process.env.VERIFYTOKEN,
    version: process.env.VERSION,
  });

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });
};

main();
