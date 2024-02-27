// Importa el paquete mysql
const mysql = require("mysql");

require("dotenv").config()

const conexion = mysql.createConnection({
  host: process.env.MYSQL_DB_HOST,
  user: process.env.MYSQL_DB_USER,
  password: process.env.MYSQL_DB_PASSWORD,
  database: process.env.MYSQL_DB_NAME,
  port: process.env.MYSQL_DB_PORT,
});

conexion.connect((error) => {
  if (error) {
    console.log("El error de conexión es: " + error);
    return;
  }
  console.log("¡Conectado a la base de datos MySQL!");
});

module.exports = conexion;
