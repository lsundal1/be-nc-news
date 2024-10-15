
const format = require('pg-format')
const db = require('../db/connection')

exports.fetchArticles = () => {
    
    let query = `SELECT articles.author, articles.title, articles.article_id, articles.topic,articles.created_at, articles.votes, articles.article_img_url, 
    COUNT(comments.comment_id) AS comment_count FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC;`

    return db.query(query).then(({rows}) => {
        return rows;
    })
}

exports.fetchArticlesById = (article_id) => {

    return db.query(`SELECT * FROM articles WHERE article_id=$1;`, [article_id]).then(({rows}) => {
        if (rows.length === 0){
            return Promise.reject({ status: 404, msg: 'article does not exist'})
        } else {
            return rows[0];
        }
    })
}

exports.fetchCommentsForArticle = (article) => {

    const id = article.article_id

    const queryStr = `SELECT * FROM comments WHERE article_id=$1 ORDER BY created_at DESC;`
    
    return db.query(queryStr,[id]).then(({rows}) => {
        return rows;
    })
}   