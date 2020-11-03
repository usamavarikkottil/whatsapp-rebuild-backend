const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
    groupName: String,
    photoUrl: String,
    // members: [userSchema],
    // admins: [userSchema],
    // messages: [messageSchema]
});

const Group = new mongoose.model("Group", groupSchema);

module.exports = Group;