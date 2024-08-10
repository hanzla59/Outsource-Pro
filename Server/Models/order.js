const User = require("../Models/user");
const Job = require("../Models/job");
const Propsal = require("../Models/proposal");
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    job:{type:mongoose.SchemaTypes.ObjectId, ref:Job, required:true},
    client:{type:mongoose.SchemaTypes.ObjectId, ref:User, required:true},
    freelancer:{type: mongoose.SchemaTypes.ObjectId, ref:User, required:true},
    proposal:{type: mongoose.SchemaTypes.ObjectId, ref:Propsal, required:true},
    rate:{type: Number, required:true},
    work:{type:String},
    status:{type:String, enum:['active', 'cancelled', 'completed'], default:'active'}

},{timestamps:true});

module.exports = mongoose.model("Order", orderSchema);