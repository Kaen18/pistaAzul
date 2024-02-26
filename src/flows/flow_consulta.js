const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')



const mainConsultas = addKeyword(['Consultar reservas', 'Ver reservas', 'reservas']).addAnswer(
    [
        'Esta en el flujo de consultas',
        'dev by Kaen',
    ]
)


module.exports = {mainConsultas}