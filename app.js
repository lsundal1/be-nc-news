const express = require('express')
const app = express();
const { psqlErrorHandler, customErrorHandler, serverErrorHandler } = require('./error-handlers.js')
const { getTopics } = require('./controllers/topics.controllers')
const { getArticles, getArticlesById, getCommentsForArticle } = require('./controllers/articles.controllers')
const endpoints = require('./endpoints.json')

app.get('/api/topics', getTopics)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id', getArticlesById)

app.get('/api/articles/:article_id/comments', getCommentsForArticle)

app.use(express.json())

app.get('/api', (req,res) => {
    res.status(200).send({endpoints})
})

app.use(psqlErrorHandler);
app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app;