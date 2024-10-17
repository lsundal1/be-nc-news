const db = require('../db/connection')

exports.fetchTopics = () => {

    const query = `SELECT * FROM topics;`

    return db.query(query).then(({rows}) => {
        return rows;
    })
}

exports.fetchTopic = (topic_name) => {

    const query = `SELECT * FROM topics WHERE slug = $1;`

    return db.query(query,[topic_name]).then(({rows}) => {

        if (rows.length === 0){
            return Promise.reject({ status: 404, msg: 'Topic does not exist'})
        }
        return rows[0]
    })
}

