const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullName: String,
    mobileNumber: {type: Number, required: true},
    status: String,
    photoUrl: String,
    groups: [groupSchema],
    messages: [messageSchema]

})