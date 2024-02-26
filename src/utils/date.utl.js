const { consultarHorarios } = require("../controllers/consultas.ctrl");

const getListDate = async () => {
  return new Promise((resolve, reject) => {
    const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const today = new Date();
    const next7Days = [];

    for (let i = 0; i < 9; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      const formattedDate = `${
        days[nextDate.getDay()]
      } ${nextDate.getFullYear()}-${(nextDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${nextDate.getDate().toString().padStart(2, "0")}`;
      next7Days.push(formattedDate);
    }
    console.log(next7Days);
    if (next7Days.length > 0) {
      resolve(next7Days);
    } else {
      reject("Error: Unable to generate the list of dates.");
    }
  });
};


const generarHoras = (fecha,cancha) => {
    return new Promise(async (resolve, reject) => {
      let horas = [];
      console.log(`[generarHoras] fecha: ${fecha}`)
      const horasOcupadas = await consultarHorarios(fecha,cancha)
      for (let i = 15; i < 22; i++) {
        const horaInicio = `${i.toString().padStart(2, '0')}:00`;
        const horaFin = `${(i + 1).toString().padStart(2, '0')}:00`;
        horas.push(`${horaInicio} -> ${horaFin}`);
      }
      horas = horas.filter(elemento => !horasOcupadas.includes(elemento));
      if (horas.length > 0) {
        resolve(horas);
      } else {
        reject('Error: No se pudo generar la lista de horas.');
      }
    });
  };
  

module.exports = { getListDate, generarHoras };
