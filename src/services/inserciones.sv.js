const conexion = require("../../config/db.js");

exports.guardarUsuario = async (correo, nombre) => {
  return new Promise((resolve, reject) => {
    conexion.query(
      "INSERT INTO usuarios (`correo`,`nombre`)VALUES(?,?)",
      [correo, nombre],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
};

exports.guardarReserva = async (
  { idUsu, idCancha, fecha, horaInicio, horaFin, ci, telefono, dia },
  idEstado = 2
) => {
  return new Promise((resolve, reject) => {
    conexion.query(
      "INSERT INTO reserva(`id_usuario`,`id_cancha`,`fecha`,`hora_inicio`,`hora_fin`,`cedula_identidad`,`numero_celular`,`id_estado`,`dia`) VALUES(?,?,?,?,?,?,?,?,?)",
      [
        idUsu,
        idCancha,
        fecha,
        horaInicio,
        horaFin,
        ci,
        telefono,
        idEstado,
        dia,
      ],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
};
