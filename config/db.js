// Importa el paquete mysql
const mysql = require("mysql");

const conexion = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "d1t3mpl4",
  database: "pistaazul",
  port: 3306,
});

conexion.connect((error) => {
  if (error) {
    console.log("El error de conexión es: " + error);
    return;
  }
  console.log("¡Conectado a la base de datos MySQL!");
});

module.exports = conexion;
