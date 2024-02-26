const conexion = require("../../config/db");

//! Verificar consulta no respeta el id_cancha en [obtenerHorariosReservas]
exports.obtenerHorariosReservas = async (fecha,cancha) => {
  console.log(`[obtenerHorariosReservas] fecha: ${fecha}`)
  return new Promise((resolve, reject) => {
    conexion.query(
      `select fecha, hora_inicio, hora_fin from reserva where fecha = '${fecha} and id_cancha = ${cancha}'`,
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

exports.horarioDisponible = async (fecha, horaInicio, horaFin) => {
  return new Promise((resolve, reject) => {
    conexion.query(
      `select fecha, hora_inicio, hora_fin from reserva where fecha = '${fecha}' and (hora_inicio = '${horaInicio}' and hora_fin = '${horaFin}')'`,
      (error, results) => {
        if (error) {
          reject(false);
        } else {
          resolve(true);
        }
      }
    );
  });
};

exports.obtenerReservas = async (telefono, ci = "unknown") => {
  return new Promise((resolve, reject) => {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
    let query = `select * from reserva where fecha >= '${formattedDate}' and numero_celular = '${telefono}' and cedula_identidad = '${ci}'`;
    query =
      ci === "unknown"
        ? query
        : `select * from reserva where fecha >= '${formattedDate}' and numero_celular = '${telefono}'`;

    conexion.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

exports.usuExist = async (correo) => {
  return new Promise((resolve, reject) => {
    conexion.query(`select * from usuarios where correo = '${correo}'`, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};
