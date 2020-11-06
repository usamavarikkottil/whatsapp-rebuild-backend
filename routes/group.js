const router = require("express").Router();
let Group = require("../models/group.model");
let User = require("../models/user.model");

router.route("/new").post((req, res) => {
    const groupName = req.body.groupName;
    const photoUrl = req.body.photoUrl;
    const newGroup = new Group({ groupName, photoUrl });

    newGroup.save()
        .then(() => res.json("New Group created Succefully!"))
        .catch((err) => res.status(400).json(`Error ${err}`))
});

router.route("/groups").get((req, res) => {
    Group.find()
        .populate("members")
        .exec(function (err, groups) {
            res.json({ groups });
            // User.find({},function(err, users) {
            //     // console.log(users);

            //   }
            // );

        })
    // .then(groups => res.json(groups))
    // .catch(error => res.status(400).json(error))
})

router.route("/:id/addmember").post((req, res) => {

    Group.findById(req.params.id, function (err, group) {
        group.members.push(req.body.userId);
        group.save(function (err) {
            res.json("User added to the group succesfully");
        })
    })

})

module.exports = router;