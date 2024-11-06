
const db = require('../db/connection')

exports.fetchArticles = (sort_by, order, topic) => {

    const validColumns = ['author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'article_img_url', 'comment_count']
    const validOrder = ['ASC', 'DESC']
    
    if (!validColumns.includes(sort_by) || !validOrder.includes(order.toUpperCase())) {
        return Promise.reject({ status: 400, msg: "bad request" });
    }
    
    let query = `
        SELECT articles.author, articles.title, articles.article_id, articles.topic,articles.created_at, articles.votes, articles.article_img_url, 
        COUNT(comments.comment_id) AS comment_count 
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id`;

    if (topic) {
        query += ` WHERE articles.topic = '${topic}'`  
    }

    query += ` GROUP BY articles.article_id
        ORDER BY ${sort_by} ${order.toUpperCase()};`;
    
    return db.query(query).then(({rows}) => {
        return rows;
    })
}

exports.fetchArticlesById = (article_id) => {

    const query = `SELECT articles.author, articles.body, articles.title, articles.article_id, articles.topic, articles.created_at, 
        articles.votes, articles.article_img_url, 
        COUNT(comments.comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON comments.article_id = articles.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;
    `
    return db.query(query,[article_id]).then(({rows}) => {
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

exports.addCommentOnArticle = (article, comment) => {

    if( typeof comment.username !== 'string' || typeof comment.body !== 'string'){
        return Promise.reject({ status: 400, msg: "bad request" });
    }
    
    const { body } = comment;
    const { article_id, author } = article;
    
    const params = [author, body, 0, article_id]
    const query = 
    `INSERT INTO comments (author, body, votes, article_id) VALUES ($1, $2, $3, $4) RETURNING *;` 
    
    return db.query(query,params).then(({rows}) => {
        return rows[0];
    })
}

exports.updateArticleVote = (article, body) => {

    const { article_id } = article
    const { inc_votes } = body

    if(typeof body.inc_votes !== 'number'){
        return Promise.reject({ status: 400, msg: "bad request" });
    }

    const params = [inc_votes, article_id]
    const query = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`

    return db.query(query,params).then(({rows}) => {
        return rows[0]
    })
}

exports.addArticle = (article) => {

    const { title, topic, author, body, article_img_url } = article

    const query = `
    INSERT INTO articles (title, topic, author, body, article_img_url)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;`
    
    return db.query(query, [title, topic, author, body, article_img_url]).then(({rows}) => {
        return rows[0]
    })
}