const mongoose = require("mongoose")


const isValidateObjectId = (UserId) => {
    if (!UserId) return false

    return mongoose.isValidObjectId(UserId)

}

module.exports= {isValidateObjectId}