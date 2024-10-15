const { fetchArticles, fetchArticlesById, fetchCommentsForArticle, addCommentOnArticle } = require('../models/articles.models')


exports.getArticlesById = (req,res,next) => {
    
    const { article_id } = req.params
    
    fetchArticlesById(article_id).then((article) => {
        res.status(200).send({article})
    })
    .catch(next)
}

exports.getArticles = (req,res,next) => {
    
    fetchArticles().then((articles) => {
        res.status(200).send({articles})
    })
    .catch(next)
}

exports.getCommentsForArticle = (req,res,next) => {

    const { article_id } = req.params

    fetchArticlesById(article_id).then((article) => {
        return fetchCommentsForArticle(article)
    })
    .then((comments) => {
        res.status(200).send({comments})
    })
    .catch(next)
}

exports.postCommentOnArticle = (req,res,next) => {

    const { article_id } = req.params
    const comment = req.body

    fetchArticlesById(article_id).then((article) => {
        return addCommentOnArticle(article, comment)
    })
    .then((newComment) => {
        res.status(200).send({newComment})
    })
    .catch(next)
}