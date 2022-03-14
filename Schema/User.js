const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        require: true
    },
  email: {
        type: String,
        unique: true,
        require: true
    },
  name: {
        type: String,
        require: true
    },
  password: {
        type: String,
        require: true
    },
  phone: {
        type: String,
    }
})

module.exports= mongoose.model('tb_users',userSchema);