const router = require("express").Router();
const Group = require("../models/group.model");
let User = require("../models/user.model");
let Message = require("../models/message.model");
const passport = require("passport");




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
            passport.authenticate("local")(req, res, () => {
                res.json({
                    "success": "true", "message": "registration successfull"
                });
            });;
        }
    });


})

router.post("/login", (req, res) => {
    const { username, password } = req.body;

    const user = new User({ username, password });

    req.login(user, (err) => {
        if (err) {
            res.status(401).json({
                "success": "false", "message": err.message
            })
        } else {
            passport.authenticate("local")(req, res, () => {
                res.json({ "success": "true", "message": "login successfull" });
            });
        }
    });
});


router.route("/:id/update").post((req, res) => { // change to user/update - passportjs

    const { fullName, mobileNumber, status, photoUrl } = req.body;

    User.findByIdAndUpdate(
        req.params.id,
        { fullName, mobileNumber, status, photoUrl },
        { new: true },
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
            { new: true },
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

router.route("/:id/").get((req, res) => /* change /:id route to  after passport implementation */ {
    if (req.isAuthenticated()) {

        User.findById(req.params.id)
            .populate([{
                path: 'messages',
                select: ["message", "receiver", "createdAt"],
                populate: [{
                    path: 'receiver',
                    select: ["fullName", "mobileNumber", "status", "photoUrl"],
                }, {
                    path: "sender",
                    select: ["fullName", "mobileNumber", "status", "photoUrl"]

                }]
            },
            {
                path: "groups"
            }])
            .exec(function (err, user) {

                if (err) res.status(500).json({ "success": "false", "message": err.message });
                res.json(user);

            })
    } else {
        res.json({ "success": "false" })
    }

})

router.route("/:id/message/new").post((req, res) => {


    const receiver = req.params.id;
    const { message, sender/* , receiver */ } = req.body;
    const newMessage = new Message({ message, sender, receiver/* , group */ });
    newMessage.save()
        .then((message) => {
            User.updateMany(
                { _id: { $in: [sender, receiver] } },
                { "$addToSet": { "messages": message._id } },
                { new: true },
                function (err, users) {
                    if (err) res.json({ "success": "false", "message": err.message });
                    res.json({ "success": true, "response-message": "A message has been sent to the user.", message, users });
                }
            )
            // console.log(message.id)

        })
        .catch((err) => res.status(400).json(`Error ${err}`))

})

module.exports = router;