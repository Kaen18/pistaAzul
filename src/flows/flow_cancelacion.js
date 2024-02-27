const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
} = require("@bot-whatsapp/bot");
const { consultarReservas } = require("../controllers/consultas.ctrl");

const mainCancelacion = addKeyword([
  "Cancelar reserva",
  "cancelar canchas",
  "cancelar",
])
.addAnswer("_Buscando reservas ..._",
  null,
  async (ctx, { flowDynamic, gotoFlow, state }) => {
    
    const reservas = await consultarReservas(ctx.from,"")

    if(reservas.length > 0){

      const message = []

      reservas.forEach( element => {
        let horarios = ""
        element.horarios.forEach( hora => {
          let horas = `_- De ${hora.inicio} a ${fin}_`
          horarios += horarios + horas
        })
        let msg = `*Reserva hecha para el ${element.fecha} en la cancha ${element.id_cancha} 🥅*\n\n`
        msg += `Horarios:`
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
  }
);
//.addAnswer(["Esta en el flujo de cancelacion", "dev by Kaen"]);

module.exports = { mainCancelacion };
