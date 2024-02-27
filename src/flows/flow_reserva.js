const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
  EVENTS,
} = require("@bot-whatsapp/bot");
const { getListDate, generarHoras } = require("../utils/date.utl");
const {
  REGEX_DATE_FORMAT,
  REGEX_DATE_FORMAT_TEXT,
  REGEX_HOUR_FORMAT,
  REGEX_HOUR_FORMAT_TEXT,
} = require("../utils/regex.format");
const { addAbortListener } = require("form-data");
const { isMailAddress } = require("../utils/format.utl");
const { userExist } = require("../controllers/consultas.ctrl");
const { saveUser, saveReserva } = require("../controllers/reserva.ctrl");

/**
 * TODO: Guardar reservas en la base de datos
 * TODO: Controlar que el horario seleccionado no este reservado
 * TODO: Agregar los botones 🔙
 * TODO: Mejorar mensaje de finalizacion
 * TODO: Enviar ubicacion
 */

// * Nodo principal para le flujo de RESERVAS
const mainReservas = addKeyword([
  "Reservar cancha",
  "reservar",
  "reservas",
  "Volver atras 🔙",
]).addAnswer(
  "Seleccione la cancha que desea reservar",
  {
    capture: true,
    buttons: [{ body: "Ver cancha 1 🥅" }, { body: "Ver cancha 2 🥅" }],
  },
  async (ctx, { flowDynamic, gotoFlow, state }) => {
    await state.update({ datosReserva: {} });

    const data = await state.getMyState();

    data.datosReserva["pista"] = 0;
    data.datosReserva["fecha"] = "";
    //data.datosReserva["horarios"] = []
    data.datosReserva["nombre"] = "";
    data.datosReserva["correo"] = "";
    data.datosReserva["telefono"] = "";

    if (ctx.body === "Ver cancha 1 🥅") await gotoFlow(flowCanchaFirst);
    if (ctx.body === "Ver cancha 2 🥅") await gotoFlow(flowCanchaSecond);
  }
);

const flowCanchaFirst = addKeyword(["Ver cancha 1 🥅", "cancha 1"]).addAnswer(
  "Te presento algunas imagenes de la cancha",
  null,
  async (ctx, { flowDynamic, state }) => {
    await flowDynamic("_Un momento mientras se procesan las imagenes ⌛_");
    await flowDynamic([
      {
        body: "imagen",
        media:
          "https://i.pinimg.com/736x/f3/71/b9/f371b9e092b84045399719471630431f.jpg",
      },
    ]);
    await flowDynamic([
      {
        body: "imagen",
        media:
          "https://elsuperhincha.com/wp-content/uploads/2021/03/saque-esquina-futsal.jpg",
      },
    ]);
    const data = state.getMyState();
    data.datosReserva.pista = 1;
    await flowDynamic(
      "¿Que accion deseas realizar?",
      {
        capture: true,
        buttons: [{ body: "Elegir cancha 🥅" }, { body: "Volver atras 🔙" }],
      },
      async (ctx, { flowDynamic, gotoFlow }) => {
        if (ctx.body === "Elegir cancha 🥅") await gotoFlow(nodoPresentarDias);
        if (ctx.body === "Volver atras 🔙") await gotoFlow(mainReservas);
      }
    );
  }
);

const flowCanchaSecond = addKeyword(["Ver cancha 1 🥅", "cancha 1"]).addAnswer(
  "Te presento algunas imagenes de la cancha",
  null,
  async (ctx, { flowDynamic, state }) => {
    await flowDynamic("_Un momento mientras se procesan las imagenes ⌛_");
    await flowDynamic([
      {
        body: "imagen",
        media:
          "https://www.acadef.es/wp-content/uploads/2020/10/F%C3%BAtbol-Sala.png",
      },
    ]);
    await flowDynamic([
      {
        body: "imagen",
        media:
          "https://es.snapsports.com/wp-content/uploads/2020/06/IBBST-futbol-sala-azul.jpg",
      },
    ]);

    const data = state.getMyState();
    data.datosReserva.pista = 2;

    await flowDynamic(
      "¿Que accion deseas realizar?",
      {
        capture: true,
        buttons: [{ body: "Elegir cancha 🥅" }, { body: "Volver atras 🔙" }],
      },
      async (ctx, { flowDynamic, gotoFlow }) => {
        if (ctx.body === "Elegir cancha 🥅") {
          await gotoFlow(nodoPresentarDias);
        }
        if (ctx.body === "Volver atras 🔙") await gotoFlow(mainReservas);
      }
    );
  }
);

const nodoPresentarDias = addKeyword(["Elegir cancha 🥅", "Reservar cancha"])
  .addAction(
    // puede usarse en un addAction o addAnswer
    async (ctx, { provider, state }) => {
      const listaFecha = await getListDate();

      console.log(listaFecha);
      const optionsList = [];

      for (let i = 0; i < listaFecha.length; i++) {
        const option = listaFecha[i];
        optionsList.push({
          id: `ID_${i}`,
          title: `${option}`,
          description: "", //`Agendar reserva de cancha el ${option}`,
        });
      }

      console.log(optionsList);

      const headerText = "";
      const bodyText = "Seleccionar fecha de reserva 📅";
      const footerText = "";
      const buttonList = "Ver fechas";
      const listParams = [
        {
          title: "Seleccionar fecha 📅",
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
    }
  )
  .addAction(
    { capture: true },
    // puede usarse en un addAction o addAnswer
    async (ctx, { provider, gotoFlow, state }) => {
      const myState = await state.getMyState();

      myState.datosReserva.fecha = ctx.title_list_reply.substring(3).trim();

      console.log(myState.datosReserva);
      console.log(ctx.title_list_reply);

      if (REGEX_DATE_FORMAT.test(ctx.title_list_reply))
        await gotoFlow(nodoPresentarHoras);
    }
  );

const nodoPresentarHoras = addKeyword(EVENTS.ACTION)
  .addAnswer("_buscando horarios disponibles..._")
  .addAction(async (ctx, { provider, state }) => {
    const data = await state.getMyState();

    if (ctx.body != "Elegir mas horarios") data.datosReserva["horarios"] = [];

    console.log(`[nodoPresentarHoras] data: ${JSON.stringify(data)}`);

    const listaHoras = await generarHoras(
      data.datosReserva.fecha,
      data.datosReserva.pista
    );

    console.log(listaHoras);
    const optionsList = [];

    for (let i = 0; i < listaHoras.length; i++) {
      const option = listaHoras[i];
      optionsList.push({
        id: `ID_${i}`,
        title: `${option}`,
        description: "",
      });
    }

    console.log(optionsList);

    const headerText = "";
    const bodyText = "Seleccionar hora de reserva ⌚";
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
  .addAction(
    { capture: true },
    // puede usarse en un addAction o addAnswer
    async (ctx, { provider, gotoFlow, state }) => {
      const myState = await state.getMyState();
      console.log("DATOS --> " + JSON.stringify(myState.datosReserva.horarios));
      myState.datosReserva.horarios.push(ctx.title_list_reply);
      console.log("DATOS --> " + JSON.stringify(myState.datosReserva));
      console.log(ctx.title_list_reply);

      if (REGEX_HOUR_FORMAT.test(ctx.title_list_reply))
        await gotoFlow(nodoMasHorarios);
    }
  );

//TODO: Controlar que no se repitan los horarios
const nodoMasHorarios = addKeyword(EVENTS.ACTION).addAnswer(
  "Selecciona la accion que desea realizar",
  {
    capture: true,
    buttons: [{ body: "Elegir mas horarios" }, { body: "Solo esos horarios" }],
  },
  async (ctx, { provider, gotoFlow }) => {
    console.log(ctx.title_list_reply);

    if (ctx.body === "Elegir mas horarios") await gotoFlow(nodoPresentarHoras);
    if (ctx.body === "Solo esos horarios")
      await gotoFlow(nodeInicioDatosClientes);
  }
);

const nodeInicioDatosClientes = addKeyword("Solo esos horarios")
  .addAnswer("*Para terminar la reserva necesito unos datos ✍️*")
  .addAnswer(
    "¿Cual es tu nombre?",
    { capture: true },
    async (ctx, { flowDynamic, state, gotoFlow }) => {
      const data = await state.getMyState();

      data.datosReserva["nombre"] = ctx.body;

      await gotoFlow(nodeObtenerCI);
    }
  );

const nodeObtenerCI = addKeyword("Solo esos horarios").addAnswer(
  "Ahora necesito tu numero de cedula 🪪",
  { capture: true },
  async (ctx, { flowDynamic, state, gotoFlow }) => {
    const data = await state.getMyState();

    data.datosReserva["ci"] = ctx.body;

    await gotoFlow(nodoObtenerCorreo);
  }
);

const nodoObtenerCorreo = addKeyword(EVENTS.ACTION).addAnswer(
  "Por ultimo necesito un correo 📧",
  { capture: true },
  async (ctx, { flowDynamic, state, gotoFlow }) => {
    const data = await state.getMyState();

    let isMail = await isMailAddress(ctx.body);

    console.log(`es mail: ${isMail}`);

    if (isMail === true) {
      console.log("SI ES CORREO");
      data.datosReserva["correo"] = ctx.body;
      data.datosReserva["telefono"] = ctx.from;

      const existeUsuario = await userExist(ctx.body, data.datosReserva.nombre);
      await state.update({ user: existeUsuario });
      await gotoFlow(nodoFinalizarReserva);
    } else {
      console.log("NO ES CORREO");
      await flowDynamic("_El correo no es valido_");
      await gotoFlow(nodoObtenerCorreo);
    }
  }
);

const nodoFinalizarReserva = addKeyword(EVENTS.ACTION).addAnswer(
  "*Reserva exitosa ✅*",
  null,
  async (ctx, { flowDynamic, state, endFlow }) => {
    const data = await state.getMyState();

    const dia = new Date(data.datosReserva.fecha);
    const reser = [];
    // ?{ idUsu, idCancha, fecha, horaInicio, horaFin, ci, telefono, dia }
    if (Array.isArray(data.datosReserva.horarios)) {
      for (const element of data.datosReserva.horarios) {
        const hora = element.split(" -> ");

        const RESERVA = {
          idUsu: data.user.id,
          idCancha: data.datosReserva.pista,
          fecha: data.datosReserva.fecha,
          horaInicio: hora[0],
          horaFin: hora[1],
          ci: data.datosReserva.ci,
          telefono: data.datosReserva.telefono,
          dia: dia.getDay(),
        };
        const resultReserva = await saveReserva(RESERVA);
        reser.push(resultReserva.insertId);
      }
    }

    if (reser.length > 0) {
      let LISTA_HORARIOS = "";
      for (let i = 0; i < data.datosReserva.horarios.length; i++) {
        const element = data.datosReserva.horarios[i];
        console.log(element);
        LISTA_HORARIOS += `${element}\n`;
      }

      const TEXTO_FINAL = `
    ------------------------\n
    *Pista ${data.datosReserva.pista} reservada:*\n
    _Nombre: ${data.datosReserva.nombre}_\n
    _Fecha: ${data.datosReserva.fecha}_\n
    _Horas:_\n
    _${LISTA_HORARIOS}_
    ------------------------
    `;

      return endFlow(TEXTO_FINAL);
    } else {
      await flowDynamic(
        "_❌ No se pudo completar la reserva por inconvenientes internos ❌_"
      );
    }
  }
);

module.exports = {
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
};
