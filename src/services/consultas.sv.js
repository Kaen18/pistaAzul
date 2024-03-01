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
    let query = `select * from reserva where fecha >= '${formattedDate}' and cedula_identidad = '${ci}' order by fecha, hora_inicio asc`;
    query =
      ci === "unknown"
        ? `select * from reserva where fecha >= '${formattedDate}' and numero_celular = '${telefono}' order by fecha, hora_inicio asc`
        : query;

        console.log(`[obtenerReservas] query ${query}`)

    conexion.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

exports.obtenerFechaReservas = async (telefono, ci = "unknown") => {
  return new Promise((resolve, reject) => {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
    let query = `SELECT fecha, id_cancha, MIN(hora_inicio) AS hora_inicio FROM reserva WHERE fecha >= '${formattedDate}' AND cedula_identidad = '${ci}' GROUP BY id_cancha, fecha ORDER BY fecha, hora_inicio ASC`;
    query =
      ci === "unknown"
        ? `SELECT fecha, id_cancha, MIN(hora_inicio) AS hora_inicio FROM reserva WHERE fecha >= '${formattedDate}' and numero_celular = '${telefono}' AND cedula_identidad = '${ci}' GROUP BY id_cancha, fecha ORDER BY fecha, hora_inicio ASC`
        : query;

        console.log(`[obtenerFechaReservas] query ${query}`)

    conexion.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

exports.obtenerHorarioPorReserva = async (fecha, ci = "unknown") => {
  return new Promise((resolve, reject) => {
    let query = `SELECT fecha, id_cancha, hora_inicio, hora_fin FROM reserva WHERE fecha = '${fecha}' AND cedula_identidad = '${ci}' ORDER BY fecha, hora_inicio ASC`;
    console.log(`[obtenerHorarioPorReserva] query ${query}`)

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
