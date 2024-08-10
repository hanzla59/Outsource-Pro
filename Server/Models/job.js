const mongoose = require("mongoose");
const User = require("../Models/user");
const Schema = mongoose.Schema;

const JobSchema = new Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    budget:{type:Number, required:true},
    deadline: Date,
    status:{type:String, enum:['open','inprogress','complete','close'], default:'open'},
    client:{type: mongoose.SchemaTypes.ObjectId, ref:User, required:true}
},{timestamps:true});

module.exports = mongoose.model('Job', JobSchema);