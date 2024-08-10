const Job = require("../Models/job");
const User = require("../Models/user");
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const propsalSchema = new Schema({
    job:{type:mongoose.SchemaTypes.ObjectId, ref:Job, required:true},
    freelancer: {type: mongoose.SchemaTypes.ObjectId, ref:User, required:true},
    coverLetter: {type:String, required:true},
    proposeRate: {type:Number, required:true},
    status:{type:String, enum:['submitted', 'accepted', 'rejected'], default:'submitted'}
},{timestamps:true});

module.exports = mongoose.model('Proposal', propsalSchema);