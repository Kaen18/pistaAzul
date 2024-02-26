const { guardarUsuario, guardarReserva } = require("../services/inserciones.sv")

exports.saveUser = async (correo,nombre) => {
    const result = await guardarUsuario(correo,nombre)
    console.log(`[saveUser] result: ${JSON.stringify(result)}`)
    return result 
}

exports.saveReserva = async ({ idUsu, idCancha, fecha, horaInicio, horaFin, ci, telefono, dia }) => {
    const result = await guardarReserva({ idUsu, idCancha, fecha, horaInicio, horaFin, ci, telefono, dia })
    console.log(`[saveReserva] result: ${JSON.stringify(result)}`)
    return result
}