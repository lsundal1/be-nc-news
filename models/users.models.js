const db = require('../db/connection')

exports.fetchUsers = () => {

    const query = 'SELECT * FROM users'
    return db.query(query).then(({rows}) => {
        return rows;
    })
}

exports.fetchUserByUsername = (username) => {

    if (!username || typeof username !== 'string'){
        return Promise.reject({ status: 400, msg: 'Bad request' })
    }

    const query = `SELECT * FROM users WHERE username = $1`

    return db.query(query,[username]).then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({ status: 404, msg: 'Username does not exist' })
        }
        return rows[0]
    })
}