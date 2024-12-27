const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true,unique:true},
    password:{type:String, required:true},
    country:{type:String,},
    resetpasswordToken:{type:String},
    resetpasswordExpiry:{type:Date},
});

module.exports=mongoose.model('User',userSchema);