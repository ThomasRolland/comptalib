"use strict";
require("dotenv").config();
const port          = process.env.PORT ? process.env.PORT : 80;
const express       = require("express");
const bodyParser    = require("body-parser");
const db            = require("./models");
const loader        = require("auto-loader");
const controllers   = loader.load(__dirname + "/controllers");
const cors          = require("cors");
const striptags     = require("striptags");
const morgan        = require('morgan')


const swaggerJSDoc  = require("swagger-jsdoc");
const swaggerUi     = require("swagger-ui-express");

const app = express();
console.log(port)
//SERVER
const server = app;

const swaggerDefinition = {
  info: {
    title: "Comptalib",
    version: "1.0",
    description: ""
  },
  host: "localhost",
  schemes: ["http"],
  basePath: "/api/v1",
};

const options = {
  swaggerDefinition,
  apis: ["./controllers/*.js", "./models/*.js"],
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "oauth_token",
      in: "header"
    }
  }
};

const swaggerSpec = swaggerJSDoc(options);

app.use(bodyParser.json());
app.use(express.static("app/public"));
app.use(cors())
app.use(morgan('combined'))

const router = express.Router();

router.use(function (req, res, next) {
  for (const property in req.body) {
    if (typeof req.body[property] === "string") {
      req.body[property] = req.body[property].trim();
      req.body[property] = striptags(req.body[property]);
    }
  }
  next();
});


const useSchema = schema => (...args) => swaggerUi.setup(schema)(...args);

router.use("/doc", swaggerUi.serve, useSchema(swaggerSpec));
router.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

for (const key in controllers) {
  router.use("/" + key, controllers[key]);
}

router.get("/", (req, res) => res.send("Hello World " + new Date()));
app.use("/api/v1", router);
db.sequelize
  .sync({
    force: false
  })
  .then(() => {
    if (server) {
      server.listen(port, () => {
        console.log("Listen on port", port);
        app.emit('serverStarted');
      });
    }

    process.on("uncaughtException", function (err) {
      console.error(
        "An uncaughtException was found, the program will end. " +
          err +
          ", stacktrace: " +
          err.stack
      );
    });
  });

module.exports = {
  app,
};
