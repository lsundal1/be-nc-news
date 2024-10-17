const articlesRouter = require("express").Router();
const {
    getArticles,
    getArticlesById,
    getCommentsForArticle,
    postCommentOnArticle,
    patchArticleVote,
} = require("../controllers/articles.controllers");

//api/articles
articlesRouter
    .route('/')
    .get(getArticles) 

articlesRouter 
    .route('/:article_id')
    .get(getArticlesById) 
    .patch(patchArticleVote)
    
articlesRouter
    .route('/:article_id/comments')
    .get(getCommentsForArticle)
    .post(postCommentOnArticle)

module.exports = articlesRouter;