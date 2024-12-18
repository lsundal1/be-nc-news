const usersRouter = require("./users-router");
const topicsRouter = require("./topics-router");
const articlesRouter = require("./articles-router");
const commentsRouter = require("./comments-router");
const apiRouter = require("express").Router();

//api
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
