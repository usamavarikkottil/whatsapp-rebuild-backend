const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    message: String,
    sender: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    group: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Group'
    },
    
}, {timestamps: true});

const Message = new mongoose.model("Message", messageSchema);

module.exports = Message;