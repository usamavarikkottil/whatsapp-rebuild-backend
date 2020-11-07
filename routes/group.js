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

router.route("/:id").get((req, res) => {
    Group.findById(req.params.id, function (err, group) {
        if (err) {
            res.status(500).json({ "success": "false", "message": err.message });
        } else {

            res.json(group);
        }
    })
})

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
            User.groups.pull(req.params.id); // Remove group id from user's groups array.
            User.save(function (err) {
                if(err) {
                    res.json({"success": "true", "message": err.message});
                } else {

                    res.json({ "success": true, "message": "The group deleted successfully" });
                }
            })
        }
    })
});

router.route("/:id/addmember").post((req, res) => {
    Group.findById(req.params.id, function (err, group) {
        if (err) {
            res.status(500).json({ "success": "false", "message": err.message });
        } else {


            group.members.addToSet(req.body.userId);


            group.save(function (err) {
                if (err) {
                    res.status(500).json({ "success": "false", "message": err.message });
                } else {
                    User.findById(req.body.userId, function (err, user) {
                        if (err) {
                            res.json({ "success": "false", "message": err.message });
                        } else {

                            user.groups.addToSet(req.params.id);
                            user.save(function (err) {
                                if (err) {
                                    res.json({ "success": "false", "message": err.message })
                                } else {
                                    res.json({ "success": "true", "message": "User has been added to the group" });
                                }
                            });
                        }
                    })


                }
            })
        }
    })

})

module.exports = router;