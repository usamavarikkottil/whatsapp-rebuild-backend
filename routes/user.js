const router = require("express").Router();
const Group = require("../models/group.model");
let User = require("../models/user.model");

router.route("/create").post((req, res) => {
    const { fullName, mobileNumber, status, photoUrl } = req.body;

    const newUser = new User({ fullName, mobileNumber, status, photoUrl });
    newUser.save()
        .then((user) => {

            res.json({ "success": "true", "message": "New User created successfully", user })
        })
        .catch(error => res.status(400).json({ "success": "false", "message": error.message }))

})

router.route("/:id/update").post((req, res) => { // change to user/update - passportjs

    const { fullName, mobileNumber, status, photoUrl } = req.body;

    User.findByIdAndUpdate(
        req.params.id,
        { fullName, mobileNumber, status, photoUrl },
        {new: true},
        function (err, user) {
            if (err) return res.status(400).json({ "success": "false", "message": err.message });
            res.json({ "success": true, "message": "The User account has been updated", user });
        }
    )

});

router.route("/:id/delete").post((req, res) => { // change after passport implementation

    User.findByIdAndRemove(req.params.id, function (err, user) {

        // console.log(user)
        if (err) res.json(err.message);

        Group.updateMany(
            { "members": req.params.id },
            { "$pull": { "members": req.params.id } },
            {new: true},
            function (err) {
                if (err) res.json({ "success": "false", "message": err.message });
                res.json({ "success": "true", "message": "The User has been deleted successfully", user });
            }
        );
    })
});

router.route("/users").get((req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(error => res.status(400).json({ "success": "false", "message": error.message }))
})

module.exports = router;