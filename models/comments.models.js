const db = require('../db/connection')

exports.removeComment = (comment_id) => {

    const query = `DELETE FROM comments WHERE comment_id = $1`

    return db.query(query,[comment_id]).then(({rowCount}) => {
        if (rowCount === 0) {
            return Promise.reject({ status: 404, msg: 'Comment not found' });
        } 
    })
}

exports.updateCommentVotes = (article_id, inc_votes) => {

    if(typeof inc_votes !== 'number'){
        return Promise.reject({ status: 400, msg: "bad request" });
    }

    const params = [inc_votes, article_id]
    const query = `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;`

    return db.query(query,params).then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({ status: 404, msg: 'Comment does not exist'})
        }
        return rows[0]
    })

}