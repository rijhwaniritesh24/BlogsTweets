//Package Imports
const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const mongoDbSessios = require('connect-mongodb-session')(session)


//File Imports

const app = express();
const db=require('./db')
const AuthRouters= require('./Controllers/Auth')
const TweetRouter=require('./Controllers/TweetRouter')
const FollowRoute=require("./Controllers/FollowRouter")

const SensitiveKeys = require('./private-constructor')
const store = new mongoDbSessios({
    uri: SensitiveKeys.uri,
    collection: "tb_sessions"
})

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: SensitiveKeys.SECRETKEY,
    resave: false,
    saveUninitialized: false,
    store: store
}))
app.use('/auth',AuthRouters)
app.use('/tweets',TweetRouter)
app.use('/follow',FollowRoute)


app.get('/', (req, res) => {
    return res.send({
        status:200,
        message: "Welcome"
    })

})

const PORT = 3600;
app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})