const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullName: String,
    mobileNumber: {type: Number, required: true},
    status: String,
    photoUrl: String,
    groups: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Group'
    }],
    // messages: [messageSchema]

})


const User = new mongoose.model("User", userSchema);

module.exports = User;