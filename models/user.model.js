const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    fullName: String,
    username: { type: Number, required: true },
    status: String,
    photoUrl: String,
    groups: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }]

})

userSchema.plugin(passportLocalMongoose, { usernameUnique: false });


const User = new mongoose.model("User", userSchema);

module.exports = User;