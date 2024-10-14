const db = require('../db/connection')

exports.fetchTopics = () => {

    

    return db.query(`SELECT * FROM topics`).then(({rows}) => {
        return rows;
    })
    .catch(() => {
        return Promise.reject({ status: 404, msg: 'Not Found'})
    })
}