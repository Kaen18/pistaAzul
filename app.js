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
 * TODO: Pasar claves sensibles a un .env
 * TODO: Crear control de .env para no queden vacios las claves
 */
const MYSQL_DB_HOST = "localhost";
const MYSQL_DB_USER = "root";
const MYSQL_DB_PASSWORD = "d1t3mpl4";
const MYSQL_DB_NAME = "pistaazul";
const MYSQL_DB_PORT = "3306";

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
    jwtToken:
      "EAAJ9nQRK4vYBO33KBRlWQOLvFxRNSataZBQuzit3VZCv2fzf2oHqo497cf7qgkmGk0F6YRZBOalR6ANZC011VOhyYz46E2sprUgTFQTl1YjzBMvPsyZC0cN0psa1F1bCSi3EBMbgJWXoAI8KuLyL9KXTdTpK5ivqvehu3G8wZADNSOHZBeMg5ljZClkgkZBiwNH4XwDEGq6vMjHe89N6ZAsYxoRDo5CuZAJ8UB5FdoK",
    numberId: "250616228128354",
    verifyToken: "K4enH3ndyma",
    version: "v19.0",
  });

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });
};

main();
