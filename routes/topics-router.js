const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/topics.controllers");

//api/topics
topicsRouter
    .route('/')
    .get(getTopics)

module.exports = topicsRouter;