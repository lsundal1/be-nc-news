const articlesRouter = require("express").Router();
const {
    getArticles,
    getArticlesById,
    getCommentsForArticle,
    postCommentOnArticle,
    patchArticleVote,
    postArticle
} = require("../controllers/articles.controllers");

//api/articles
articlesRouter
    .route('/')
    .get(getArticles)
    .post(postArticle) 

articlesRouter 
    .route('/:article_id')
    .get(getArticlesById) 
    .patch(patchArticleVote)
    
articlesRouter
    .route('/:article_id/comments')
    .get(getCommentsForArticle)
    .post(postCommentOnArticle)

module.exports = articlesRouter;