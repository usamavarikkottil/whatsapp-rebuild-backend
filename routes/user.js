const router = require("express").Router();
const Group = require("../models/group.model");
let User = require("../models/user.model");

router.route("/create").post((req, res) => {
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

router.route("/:id/update").post((req, res) => { // change to user/update - passportjs
    const fullName = req.body.fullName;
    const mobileNumber = req.body.mobileNumber;
    const status = req.body.status ;
    const photoUrl = req.body.photoUrl;

    User.findById(req.params.id, function (err, user) { // Change to req.user.id after passport integration
        console.log(fullName);
        fullName && (user.fullName = fullName);
        mobileNumber && (user.mobileNumber = mobileNumber);
        status && (user.status = status);
        photoUrl && (user.photoUrl = photoUrl);
        user.save(function (err) {
            if (err) {
                res.json(err.message);
            } else {
                res.json({ "success": true, "message": "The user has updated successfully" });
            }
        })

    })
});

router.route("/:id/delete").post((req, res) => { // change after passport implementation

    User.findByIdAndRemove(req.params.id, function (err, user) {

        // console.log(user)
        if (err) {
            res.json({"success": "false", "message": err.message});
        } else {
            Group.members.pull(req.params.id); // Remove userid from group's members list
            Group.save(function (err) {
                if (err) {
                    res.json({"success": "false", "message": err.message});
                } else {

                    res.json({ "success": true, "message": "The User account has deleted successfully" });
                }
            });
        }
    })
});

router.route("/users").get((req, res) => {
    User.find()
    .then(users => res.json(users))
    .catch(error => res.status(400).json({"success": "false", "message": error.message}))
})

module.exports = router;