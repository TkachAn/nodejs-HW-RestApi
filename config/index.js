require("dotenv").config();

const {SECRET, HOST_DB, PORT, SING_UP_EMAIL} = process.env;

module.exports = {
  SECRET,
  HOST_DB,
  PORT,
  SING_UP_EMAIL,
};
