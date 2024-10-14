
const db = require('../db/connection')

exports.fetchArticles = (article_id) => {

    const regex = /\d+/

    if(!regex.test(article_id)){
        return Promise.reject({ status: 400, msg: 'bad request'})
    }

    return db.query('SELECT * FROM articles WHERE article_id=$1;', [article_id]).then(({rows}) => {
        if (rows.length === 0){
            return Promise.reject({ status: 404, msg: 'article does not exist'})
        } else {
            return rows[0];
        }
    })
    
}