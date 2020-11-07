const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    message: String,
    sender: userSchema
    
}, {timestamps: true});