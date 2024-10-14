const express = require('express')
const app = express();
const { psqlErrorHandler, customErrorHandler, serverErrorHandler } = require('./error-handlers')
const { getTopics } = require('./controllers/topics.controllers')
const endpoints = require('./endpoints.json')

app.get('/api/topics', getTopics)

app.use(express.json())

app.get('/api', (req,res) => {
    res.status(200).send({endpoints})
})

app.use(psqlErrorHandler);
app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app;