const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FollowSchema = new Schema({

    followerUserId: {
        type: Schema.Types.ObjectId,
        require: true
    },
    followingUserId: {
        type: Schema.Types.ObjectId,
        require: true
    },
    creationDateTime: {
        type: String,
        required: true

    }

})

module.exports= mongoose.model("follow_db",FollowSchema)