const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tweetsSchema = new Schema({

    title: {
        require: true,
        type: String,
    },
    bodyText: {
        require: true,
        type: String,
    },
    userId: {
        require: true,
        type: Schema.Types.ObjectId,
    },
    creationDateTime: {
       require: true,
       type: String,
}

})

module.exports= mongoose.model("tweet_db",tweetsSchema)