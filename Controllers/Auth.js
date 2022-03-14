const express = require('express');
//const UserSchema = require('../Schema/User');
const authRouters = express.Router();

const { cleanUpAndValidate, isAuth} = require('../Utils/AuthUtils');

const User = require('../Models/User');
const { db } = require('../Schema/User');


// Router Auth Api's

authRouters.get('/', (req, res) => {
    return res.send({
        status: 200,
        message: "Welcome to Routers"
    })

})

authRouters.post('/login', async (req, res) => {

    const { loginId, password } = req.body
    if (!loginId || !password) {
        return res.send({
            status: 500,
            message: "Plz Provide the LoginId and Password"
        })
    }

    try {
        const dbuser = await User.loginUser({ loginId, password })
        console.log(dbuser)
        req.session.isAuth= true
        req.session.user = {
            email: dbuser.email,
            username: dbuser.username,
            name: dbuser.name,
            userId: dbuser.userId
        }

        return res.send({
            Status: 200,
            Message: "Login Successfully",
            data: {
                email: dbuser.email,
                username: dbuser.username,
                name: dbuser.name,
                userId: dbuser.userId
            }
        })
    }
    catch (err) {
        return res.send({
            status: 400,
            Message: err
        })
    }

})

authRouters.post('/register', async (req, res) => {
    const { name, username, email, password, phone } = req.body;
    //console.log(name, username, email, password, phone)

    cleanUpAndValidate({ username, name, email, password, phone }).then(() => {

    }).catch((err) => {
        return res.send({
            status: 400,
            Message: err,

        })
    })

    try {
        await User.verifyEmailandUsernameExist({ username, email })
    }
    catch (err) {
        return res.send({
            status: 400,
            message: err
        })
    }

    const user = new User({ name, password, email, username, phone })
    try {
        const dbuser = await user.regsiterUser();
        console.log('Registered');
        return res.send({
            status: 200,
            message: "Register Succesfully .Plz login in",
            data: dbuser
        })
    }
    catch (err) {
        return res.send({
            status: 400,
            message: err
        })
    }



})

authRouters.post('/logout', isAuth,(req, res) => {
   const userDetails= req.session.user;
   
   req.session.destroy(err=>{
       if(err){
           return res.send({
               status:400,
               Message:err
           })
       }
       res.send({
         status: 200,
         Message:"Logout SuccessFully"
       })
   })
})

module.exports = authRouters