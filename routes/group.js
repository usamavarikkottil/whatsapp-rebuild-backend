const router = require("express").Router();
let Group = require("../models/group.model");
let User = require("../models/user.model");

router.route("/groups").get((req, res) => {
    // console.log(req.user); undefined
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

router.route("/create").post((req, res) => {
    const groupName = req.body.groupName;
    const photoUrl = req.body.photoUrl;
    const newGroup = new Group({ groupName, photoUrl });

    // newGroup.members.push(req.user.id); // Adding group admin to the group
    newGroup.save()
        .then(() => res.json("New Group created Succefully!"))
        .catch((err) => res.status(400).json(`Error ${err}`))
});

router.route("/:id/update").post((req, res) => {
    const groupName = req.body.groupName;
    const photoUrl = req.body.photoUrl;
    Group.findById(req.params.id, function (err, group) {
        groupName && (group.groupName = groupName);
        photoUrl && (group.photoUrl = photoUrl);
        group.save(function (err) {
            if (err) {
                res.json(err.message);
            } else {
                res.json({ "success": true, "message": "The group edited successfully" });
            }
        })

    })
});

router.route("/:id/delete").post((req, res) => {

    Group.findByIdAndRemove(req.params.id, function (err, group) {

        console.log(group)
        if (err) {
            res.json(err.message);
        } else {
            res.json({ "success": true, "message": "The group deleted successfully" });
        }
    })
});

router.route("/:id/addmember").post((req, res) => {

    Group.findById(req.params.id, function (err, group) {
        group.members.push(req.body.userId);
        group.save(function (err) {
            res.json("User added to the group succesfully");
        })
    })

})

module.exports = router;