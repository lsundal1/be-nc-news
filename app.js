const express = require("express");
const app = express();
const { psqlErrorHandler, customErrorHandler, serverErrorHandler } = require("./error-handlers.js");
const endpoints = require("./endpoints.json");
const apiRouter = require("./routes/api-router.js");

app.use(express.json());

app.use("/api", apiRouter);

app.get("/api", (req, res) => {
    res.status(200).send({ endpoints });
});

app.use(psqlErrorHandler);
app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
