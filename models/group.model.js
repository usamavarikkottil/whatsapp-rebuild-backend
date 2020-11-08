const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
    groupName: String,
    photoUrl: String,
    members: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Message'
    }]
    // admins: [userSchema],
});

const Group = new mongoose.model("Group", groupSchema);

module.exports = Group;