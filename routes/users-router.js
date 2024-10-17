const usersRouter = require("express").Router();
const {
    getUsers,
    getUserByUsername,
} = require("../controllers/users.controllers.js");

//api/users
usersRouter
    .route('/')
    .get(getUsers)

usersRouter
    .route('/:username')
    .get(getUserByUsername)

module.exports = usersRouter;