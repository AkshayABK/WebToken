const mongoose = require('mongoose')

let usersSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

let schema = mongoose.model("Schema",usersSchema);
module.exports = schema;