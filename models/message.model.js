const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    message: String,
    photoUrl: String,
    user: [userSchema]
    
}, {timestamps: true});