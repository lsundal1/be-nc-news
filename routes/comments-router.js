const commentsRouter = require("express").Router();
const { deleteComment, patchCommentVotes } = require("../controllers/comments.controllers.js");

//api/comments
commentsRouter
    .route('/:comment_id')
    .delete(deleteComment)
    .patch(patchCommentVotes)

module.exports = commentsRouter;