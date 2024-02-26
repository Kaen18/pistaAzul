const { REGEX_VALID_MAILADDRESS } = require("./regex.format");

const isMailAddress = async (correo) => {
  console.log(correo);
  var expresion = REGEX_VALID_MAILADDRESS;

  console.log(expresion.test(correo));
  return expresion.test(correo);
};

module.exports = { isMailAddress };
