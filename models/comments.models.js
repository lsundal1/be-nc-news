const format = require('pg-format')
const db = require('../db/connection')

exports.removeComment = (comment_id) => {

    const query = `DELETE FROM comments WHERE comment_id = $1`

    return db.query(query,[comment_id]).then(({rowCount}) => {
        if (rowCount === 0) {
            return Promise.reject({ status: 404, msg: 'Comment not found' });
        }
    })
}