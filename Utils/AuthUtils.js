const req = require('express/lib/request')
const validator = require('validator')
const cleanUpAndValidate=({ username, name, email, password, phone})=> {
    //console.log(username, name, email, password, phone)
    return new Promise((resolve, reject) => {

        if (!(name && username && email && password)) {
           reject('Missing Parameters')
        }
        if (!validator.isEmail(email))
           { return reject('Invalid Email')}

        if (phone && phone.length !== 10)
            {return reject('Invalid phone number')}

        if (username.length < 3)
            {return reject("username is too short")}

        if (username.length > 50)
            return reject("username is too long")

        if (password.length < 6)
            return reject('password is too short')

        if (!validator.isAlphanumeric(password))
            return reject('Password should be Alphanumeric')
        
        if(name.length >100)
            return reject ('Name is too long')

        return resolve();
    })
}

const isAuth=(req,res,next)=>{
    if(req.session.isAuth)return next()
    
    else{
        res.send({
            Status: 404,
            Message: "Session Expire. Plz Login in"
        })
    }
}
module.exports= {cleanUpAndValidate, isAuth}