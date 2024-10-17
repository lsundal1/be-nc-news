const { fetchArticles, fetchArticlesById, fetchCommentsForArticle, addCommentOnArticle, updateArticleVote } = require('../models/articles.models')
const { fetchTopic } = require('../models/topics.models')

exports.getArticlesById = (req,res,next) => {
    
    const { article_id } = req.params
    
    fetchArticlesById(article_id).then((article) => {
        res.status(200).send({article})
    })
    .catch(next)
}

exports.getArticles = (req,res,next) => {

    const { sort_by = 'created_at', order = 'DESC', topic } = req.query
    if(topic){ 
        fetchTopic(topic).then(({slug}) => {
            return fetchArticles(sort_by, order, slug)
        }).then((articles) => {       
            res.status(200).send({ articles });
        })
        .catch(next)
    } else {
        fetchArticles(sort_by, order).then((articles) => {        
            res.status(200).send({ articles });
        })
        .catch(next)
    }
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

exports.patchArticleVote = (req,res,next) => {

    const { article_id } = req.params
    const { body } = req

    fetchArticlesById(article_id).then((article) => {
        return updateArticleVote(article, body)
    })
    .then((updatedArticle) => {
        res.status(200).send({updatedArticle})
    })
    .catch(next)
}