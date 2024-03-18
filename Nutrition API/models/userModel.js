const mongoose = require('mongoose')

const userSchema = mongoose.Schema({              // Creating Schema
    name: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    age: {
        type:Number,
        required:true,
        min:true
    },
})

const userModel = mongoose.model("users",userSchema);

module.exports = userModel;