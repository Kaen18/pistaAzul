const { REGEX_VALID_MAILADDRESS } = require("./regex.format");

const isMailAddress = async (correo) => {
  console.log(correo);
  var expresion = REGEX_VALID_MAILADDRESS;

  console.log(expresion.test(correo));
  return expresion.test(correo);
};

const formatArrayReserva = (data) => {
  const horariosPorFecha = {};

  data.forEach((elemento) => {
    const fecha = elemento.fecha;

    if (!horariosPorFecha[fecha]) {
      horariosPorFecha[fecha] = {
        fecha: fecha,
        id_cancha: elemento.id_cancha,
        horarios: [],
      };
    }

    horariosPorFecha[fecha].horarios.push({
      inicio: elemento.hora_inicio,
      fin: elemento.hora_fin,
    });
  });

  return Object.values(horariosPorFecha);
};
module.exports = { isMailAddress, formatArrayReserva };
