const mongoose = require('mongoose')

const UsersSchema = new mongoose.Schema({
    image: String,
    name: String,
    price: String
    
})

const UsersModel = mongoose.model("users",UsersSchema)
module.exports = UsersModel