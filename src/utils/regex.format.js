// * REGEX PARA CONTROL DEL FORMATO DE FECHAS
const REGEX_DATE_FORMAT = /^(Dom|Lun|Mar|Mié|Jue|Vie|Sáb) \d{4}-\d{2}-\d{2}$/;
const REGEX_DATE_FORMAT_TEXT = `/^(Dom|Lun|Mar|Mié|Jue|Vie|Sáb) \d{4}-\d{2}-\d{2}$/`;

// * REGEX PARA CONTROL DEL FORMATO DE LOS HORARIOS

const REGEX_HOUR_FORMAT =
  /^([01][0-9]|2[0-3]):[0-5][0-9] -> ([01][0-9]|2[0-3]):[0-5][0-9]$/;
const REGEX_HOUR_FORMAT_TEXT = `/^([01][0-9]|2[0-3]):[0-5][0-9] -> ([01][0-9]|2[0-3]):[0-5][0-9]$/`;

//*REGEX PARA CONTROL DE CORREOS

const REGEX_VALID_MAILADDRESS = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//* REGEX Formato ISO fecha

const REGEX_FECHA_ISO = /^\d{4}-\d{2}-\d{2}$/;


module.exports = {
  REGEX_DATE_FORMAT,
  REGEX_DATE_FORMAT_TEXT,
  REGEX_HOUR_FORMAT,
  REGEX_HOUR_FORMAT_TEXT,
  REGEX_VALID_MAILADDRESS,
  REGEX_FECHA_ISO
};
