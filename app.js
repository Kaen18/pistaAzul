const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
} = require("@bot-whatsapp/bot");
require("dotenv").config();

const MetaProvider = require("@bot-whatsapp/provider/meta");
const MySQLAdapter = require("@bot-whatsapp/database/mysql");
const { mainConsultas, presentarReservas } = require("./src/flows/flow_consulta");
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
const { mainCancelacion, nodoPresentarFechas, nodoPresentarHorarios } = require("./src/flows/flow_cancelacion");

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
    presentarReservas,
    nodoPresentarFechas,
    nodoPresentarHorarios,
  ]);

  const adapterProvider = createProvider(MetaProvider, {
    jwtToken: process.env.JWTOKEN,
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
