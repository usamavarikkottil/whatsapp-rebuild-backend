const router = require("express").Router();
let User = require("../models/user.model");

router.route("/new").post((req, res) => {
    const fullName = req.body.fullName;
    const mobileNumber = req.body.mobileNumber;
    const status = req.body.status ;
    const photoUrl = req.body.photoUrl;

    const newUser = new User({fullName, mobileNumber, status, photoUrl});
    newUser.save()
    .then(() => {

        res.json({"success": "true", "message": "New User created successfully"})
    })
    .catch(error => res.status(400).json({"success": "false", "message": error.message}))

})

router.route("/users").get((req, res) => {
    User.find()
    .then(users => res.json(users))
    .catch(error => res.status(400).json({"success": "false", "message": error.message}))
})

module.exports = router;