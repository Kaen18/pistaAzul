const {
  obtenerHorariosReservas,
  usuExist,
} = require("../services/consultas.sv");
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
