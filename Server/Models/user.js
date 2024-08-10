const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {type: String, unique: true,required: true},
    email:{type:String, unique:true, required:true },
    password:{type:String, required:true},
    role:{type:String, enum:['client','freelancer'], required:true},
    name:{type:String},
    bio:{type:String},
    skills: [{type:String}],
    hourlyrate:{type:String},
    rating:{type:String},
    isban:{type:Boolean, default:false}
},{timestamps:true});

module.exports = mongoose.model('User', userSchema);