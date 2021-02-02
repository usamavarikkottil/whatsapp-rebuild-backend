const router = require("express").Router();
const User = require("../models/user.model");
const passport = require("passport");
require("dotenv").config();
const jwt = require("jsonwebtoken");

router.route("/create").post((req, res) => {
    const { fullName, username, status, photoUrl } = req.body;

    const newUser = new User({ fullName, username, status, photoUrl });
    // newUser.save()
    //     .then((user) => {

    //         res.json({ "success": "true", "message": "New User created successfully", user })
    //     })
    //     .catch(error => res.status(400).json({ "success": "false", "message": error.message }))
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            res.status(401).json({
                "success": "false", "message": err.message
            })
        } else {
            passport.authenticate("local", { session: false })(req, res, () => {
                const token = jwt.sign({ username: user.username, id: user.id }, process.env.JWT_SECRET);
                res.json({ user, token });
            });
        }
    });


})

router.post("/login", (req, res) => {
    const { username, password } = req.body;

    const user = new User({ username, password });

    req.login(user, { session: false }, (err) => {
        if (err) {
            res.status(401).json({
                "success": "false", "message": err.message
            })
        } else {
            passport.authenticate("local", { session: false })(req, res, () => {
                const token = jwt.sign({ username: user.username, id: user.id }, process.env.JWT_SECRET);
                res.json({ user, token });
            });
        }
    });
});


module.exports = router;