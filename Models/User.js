const UserSchema = require('../Schema/User')
const bcrypt = require('bcrypt');
const { db } = require('../Schema/User');
const { reject } = require('bcrypt/promises');

class User {

    username;
    email;
    name;
    password;
    phone;

    constructor({ username, email, password, name, phone }) {
        this.email = email;
        this.username = username;
        this.password = password;
        this.name = name;
        this.phone = phone;
    }

    static verifyEmailandUsernameExist({ username, email }) {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await UserSchema.findOne({ $or: [{ username }, { email }] })
                if (user) {
                    return reject('Email or Username Exist')
                }
                return resolve();
            }
            catch (err) {
                console.log(err)
                return reject(err)
            }

        })

    }


    static verifyUserIdExist(userId) {
        return new Promise(async (resolve, reject) => {
            try {
                let userIdExist = await UserSchema.findOne({ _id: userId })
                resolve(userIdExist)

            }
            catch (err) {
                reject(err)
            }



        })
    }




    regsiterUser() {
        return new Promise(async (resolve, reject) => {

            const hashpassword = await bcrypt.hash(this.password, 15)
            console.log(hashpassword)
            const user = new UserSchema({
                email: this.email,
                username: this.username,
                password: hashpassword,
                name: this.name,
                phone: this.phone
            })

            try {
                const dbuser = await user.save();
                return resolve(dbuser)
            }
            catch (err) {
                return reject(err)
            }
        })
    }


    static loginUser({ loginId, password }) {
        return new Promise(async (resolve, reject) => {

            try {
                const userDetails = await UserSchema.findOne({ $or: [{ email: loginId }, { username: loginId }] })

                if (!userDetails) {
                    return reject("No user found")
                }

                const isMatch = bcrypt.compare(password, userDetails.password)
                if (isMatch) {

                    return resolve({
                        email: userDetails.email,
                        username: userDetails.username,
                        name: userDetails.name,
                        userId: userDetails._id
                    })
                }

                else {
                    return reject({
                        status: 400,
                        Message: "Password Doesn't Matches"
                    })
                }

            }
            catch (err) {
                return reject(err)
            }
        })
    }

}


module.exports = User