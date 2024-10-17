const db = require('../db/connection')

exports.fetchUsers = () => {

    const query = 'SELECT * FROM users'
    return db.query(query).then(({rows}) => {
        return rows;
    })
}

exports.fetchUserByUsername = (username) => {

    const query = `SELECT * FROM users WHERE username = $1`

    return db.query(query,[username]).then(({rows}) => {
        return rows[0]
    })

}