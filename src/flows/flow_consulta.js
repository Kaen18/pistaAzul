const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot');
const { mainReservas } = require('./flow_reserva');
const { mainCancelacion } = require('./flow_cancelacion');
const { consultarReservas } = require('../controllers/consultas.ctrl');



const mainConsultas = addKeyword(['Consultar reservas', 'Ver reservas', 'reservas']).addAnswer("_Buscando reservas ..._",
null,
async (ctx, { flowDynamic, gotoFlow, state }) => {
  
  const reservas = await consultarReservas(ctx.from)

  if(reservas.length > 0){

    const message = []

    reservas.forEach( element => {
      let horarios = ""
      element.horarios.forEach( horaItem => {
        console.log(`[mainConsultas] flow: ${JSON.stringify(horaItem)}`)
        let horas = `_- De ${horaItem.inicio} a ${horaItem.fin}_\n`
        horarios += horas
      })
      let msg = `*Reserva hecha para el ${element.fecha.toISOString().substring(0,10)} en la cancha ${element.id_cancha} 🥅*\n\n`
      msg += `Horarios:\n`
      msg += `${horarios}`
      message.push(msg)
    })

    
    for (let i = 0; i < message.length; i++) {
      const element = message[i];
      await flowDynamic(element)
    }
    
  }else{
    await flowDynamic(`No posees Reservas 🥲`)
  }

  await flowDynamic(
    "¿Que accion deseas realizar?",
    {
      capture: true,
      buttons: [{ body: "Cancelar reserva" }, { body: "Reservar cancha" }],
    },
    async (ctx, { flowDynamic, gotoFlow }) => {
      if (ctx.body === "Cancelar reserva") await gotoFlow(mainCancelacion);
      if (ctx.body === "Reservar cancha") await gotoFlow(mainReservas);
      
    }
  );
}
);



module.exports = {mainConsultas}