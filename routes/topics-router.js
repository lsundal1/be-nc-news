const topicsRouter = require("express").Router();
const { getTopics, getTopic } = require("../controllers/topics.controllers");

//api/topics
topicsRouter
    .route('/')
    .get(getTopics)

topicsRouter
    .route('/:topic_name')
    .get(getTopic)

module.exports = topicsRouter;