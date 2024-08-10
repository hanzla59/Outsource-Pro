const { required } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    token:{type:String, require:true},
    userId:{type:String, required:true}
},{timestamps:true})

module.exports = mongoose.model('Token', tokenSchema);