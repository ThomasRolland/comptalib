require("dotenv").config();
const process = require("process");

const env = process.env.NODE_ENV || 'development';
const config = {
  development: {
    "username": "root",
    "password": "",
    "database": "comptalib",
    "port": 25060,
    "host": "127.0.0.1",
    "SECRET_KEY": "test_comptalib",
    "dialect": "mysql",
  },
  prod: {
    "username": "",
    "password": "",
    "database": "",
    "port": "",
    "host": "",
    "SECRET_KEY": "",
    "dialect": "",
  }
}

module.exports = config[env];
