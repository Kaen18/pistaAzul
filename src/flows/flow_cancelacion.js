const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
  EVENTS,
} = require("@bot-whatsapp/bot");
const {
  consultarReservas,
  consultarFechasReservas,
  consultarHoraPorFecha,
} = require("../controllers/consultas.ctrl");
const { state } = require("../../config/db");
const { REGEX_FECHA_ISO } = require("../utils/regex.format");

const mainCancelacion = addKeyword([
  "Cancelar reserva",
  "cancelar canchas",
  "cancelar",
]).addAnswer(
  "Necesito tu numero de cédula",
  { capture: true },
  async (ctx, { flowDynamic, gotoFlow, state }) => {
    const dataState = await state.update({ ci: ctx.body });

    await gotoFlow(nodoPresentarFechas);
  }
);
//.addAnswer(["Esta en el flujo de cancelacion", "dev by Kaen"]);

const nodoPresentarFechas = addKeyword(EVENTS.ACTION)
  .addAction(async (ctx, { provider, state }) => {
    const dataState = await state.getMyState();
    const optionsList = []
    const reservas = await consultarFechasReservas(ctx.from, dataState.ci);

    for (let i = 0; i < reservas.length; i++) {
      const option = reservas[i];
      optionsList.push({
        id: `ID_${i}`,
        title: `${option.fecha}`,
        description: `Fecha correspondiente a la cancha ${option.cancha}`,
      });
    }

    console.log(optionsList);

    const headerText = "";
    const bodyText = "Seleccionar la fecha de reserva ⌚";
    const footerText = "";
    const buttonList = "Ver fechas";
    const listParams = [
      {
        title: "Seleccionar fecha ⌚",
        rows: optionsList,
      },
    ];
    await provider.sendList(
      ctx.from,
      headerText,
      bodyText,
      footerText,
      buttonList,
      listParams
    );
  })
  .addAction(
    { capture: true },
    async (ctx, { flowDynamic, gotoFlow, state }) => {
      console.log(`[nodoPresentarFechas] capture: ${JSON.stringify(ctx)}`)
      if (REGEX_FECHA_ISO.test(ctx.title_list_reply)) {
       await state.update({fechaCancelSeled: ctx.title_list_reply})

        await gotoFlow(nodoPresentarHorarios)
      } else {

        await flowDynamic(`Debe seleccionar una de las opciones`)
        await gotoFlow(nodoPresentarFechas)
      }
    }
  );

  const nodoPresentarHorarios = addKeyword(EVENTS.ACTION)
  .addAction(async (ctx, { provider, state }) => {
    const dataState = await state.getMyState();
    const optionsList = []
    const reservasH = await consultarHoraPorFecha(dataState.fechaCancelSeled, dataState.ci);

    for (let i = 0; i < reservasH.length; i++) {
      const option = reservasH[i];
      optionsList.push({
        id: `ID_${i}`,
        title: `${option.inicio} -> ${option.fin}`,
        description: `Rango de horario del ${option.fecha} correspondiente a la cancha ${option.cancha}`,
      });
    }

    console.log(optionsList);

    const headerText = "";
    const bodyText = "Seleccionar la hora de reserva ⌚";
    const footerText = "";
    const buttonList = "Ver horas";
    const listParams = [
      {
        title: "Seleccionar hora ⌚",
        rows: optionsList,
      },
    ];
    await provider.sendList(
      ctx.from,
      headerText,
      bodyText,
      footerText,
      buttonList,
      listParams
    );
  })
  .addAction({capture:true},async (ctx, { flowDynamic,provider, state }) => {
    const dataState = await state.getMyState();
    await flowDynamic(`❌ Horario del ${ctx.title_list_reply} correspondiente a la fecha ${dataState.fechaCancelSeled} cancelada ❌`)
  })

module.exports = { mainCancelacion, nodoPresentarFechas, nodoPresentarHorarios };
