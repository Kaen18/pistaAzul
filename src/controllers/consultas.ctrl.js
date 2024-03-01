const {
  obtenerHorariosReservas,
  usuExist,
  obtenerReservas,
  obtenerFechaReservas,
  obtenerHorarioPorReserva,
} = require("../services/consultas.sv");
const { formatArrayReserva } = require("../utils/format.utl");
const { saveUser } = require("./reserva.ctrl");

// TODO: Control de Errores
exports.consultarHorarios = async (fecha, cancha) => {
  const result = await obtenerHorariosReservas(fecha, cancha);
  let dataReturn = [];
  console.log(`[consultarHorarios] resultado: ${JSON.stringify(result)}`);

  if (result.length > 0) {
    result.forEach((items) => {
      dataReturn.push(
        `${items.hora_inicio.slice(0, -3)} -> ${items.hora_fin.slice(0, -3)}`
      );
    });
  }

  return dataReturn;
};
exports.userExist = async (correo, nombre) => {
  const dataReturn = {
    exist: false,
    id: "",
  };

  try {
    const result = await usuExist(correo);

    console.log(`[userExist] result: ${JSON.stringify(result)}`);

    if (result.length > 0) {
      dataReturn.exist = true;
      result.forEach((items) => {
        dataReturn.id = items.id;
      });
    } else {
      const user = await saveUser(correo, nombre);
      console.log(`[userExist] user: ${JSON.stringify(user)}`);
      /*if (Array.isArray(user)) {
        dataReturn.exist = true;
        user.forEach((element) => {
          dataReturn.id = element.id;
        });
      } else {*/
      dataReturn.exist = true;
      dataReturn.id = user.insertId;
      console.error(`[nodoFinalizarReserva] user no es un array`);
    }

    return dataReturn;
  } catch (error) {
    console.error(`[userExist] Error: ${error}`);
    throw error;
  }
};

exports.consultarReservas = async (telefono, cedula) => {
  try {
    console.log(`[consultarReservas] telefono: ${telefono}`);
    const result = await obtenerReservas(telefono, cedula);
    console.log(`[consultarReservas] result: ${JSON.stringify(result)}`);
    if (Array.isArray(result) && result.length > 0) {
      const formatReserva = await formatArrayReserva(result);
      console.log(
        `[consultarReservas] formatReserva: ${JSON.stringify(formatReserva)}`
      );
      return formatReserva;
    } else {
      return [];
    }
  } catch (error) {
    console.error(`[consultarReservas] error: ${error}`)
    return []
  }
};

exports.consultarFechasReservas = async (telefono, cedula) => {
  try {
    console.log(`[consultarFechasReservas] telefono: ${telefono}`);
    const result = await obtenerFechaReservas(telefono, cedula);
    if (Array.isArray(result) && result.length > 0) {
      const dataReturn = [];
      for (let i = 0; i < result.length; i++) {
        const element = result[i];
        dataReturn.push({
          fecha: element.fecha.toISOString().substring(0, 10),
          cancha: element.id_cancha,
        });
      }
      return dataReturn;
    } else {
      return [];
    }
  } catch (error) {
    console.error(`[consultarFechasReservas] error: ${error}`)
    return []
  }
};

exports.consultarHoraPorFecha = async (fecha,cedula) => {
  try {
    const result = await obtenerHorarioPorReserva(fecha, cedula);
    if (Array.isArray(result) && result.length > 0) {
      const dataReturn = [];
      for (let i = 0; i < result.length; i++) {
        const element = result[i];
        dataReturn.push({
          fecha: element.fecha.toISOString().substring(0, 10),
          cancha: element.id_cancha,
          inicio:element.hora_inicio,
          fin:element.hora_fin
        });
      }
      return dataReturn;
    } else {
      return [];
    }
  } catch (error) {
    console.error(`[consultarHoraPorFecha] error: ${error}`)
    return []
  }
}
