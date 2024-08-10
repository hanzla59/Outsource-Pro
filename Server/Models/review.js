const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require("../Models/user");
const Order = require("../Models/order");

const reviewSchema = new Schema({
    client:{type: mongoose.SchemaTypes.ObjectId, ref:User, required:true},
    freelancer:{type:mongoose.SchemaTypes.ObjectId, ref:User, required:true},
    order:{type:mongoose.SchemaTypes.ObjectId, ref:Order, required:true},
    rating:{type:Number, required:true},
    comment:{type:String, required:true},
    createdAt:{type:Date, default:Date.now}
},{timestamps:true});

module.exports = mongoose.model("Review", reviewSchema);