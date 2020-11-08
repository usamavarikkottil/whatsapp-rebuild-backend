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
    const { groupName, photoUrl } = req.body;

    const newGroup = new Group({ groupName, photoUrl });

    // newGroup.members.push(req.user.id); // Adding group admin to the group
    newGroup.save()
        .then((group) => res.json({ "success": true, "message": "The group has created successfully.", group }))
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
    const { groupName, photoUrl } = req.body;
    // console.log({ groupName, photoUrl });

    Group.findByIdAndUpdate(
        req.params.id,
        { groupName, photoUrl },
        { new: true },
        function (err, group) {
            if (err) return res.status(400).json({ "success": "false", "message": err.message });
            res.json({ "success": true, "message": "The group edited successfully", group });
        }
    )
});

router.route("/:id/delete").post((req, res) => {

    Group.findByIdAndRemove(req.params.id, function (err, group) {

        // console.log(group)
        if (err) res.json(err.message);

        User.updateMany(
            { "groups": req.params.id },
            { "$pull": { "groups": req.params.id } },
            { new: true },
            function (err) {
                if (err) res.json({ "success": "false", "message": err.message });
                res.json({ "success": "true", "message": "The group has been deleted successfully", group });
            }
        );


    })
});

router.route("/:id/addmember").post((req, res) => {

    Group.findByIdAndUpdate(
        req.params.id,
        { "$addToSet": { "members": req.body.userId } },
        { new: true },
        function (err, group) {
            if (err) res.json({ "success": "false", "message": err.message });
            User.findByIdAndUpdate(
                req.body.userId,
                { "$addToSet": { "groups": req.params.id } },
                function (err, user) {
                    if (err) res.json({ "success": "false", "message": err.message });
                    res.json({ "success": "true", "message": "User has been added to the group", group });
                }
            )

        }
    );

})

router.route("/:id/message/new").post((req, res) => {

})

router.route("/:id/message/").get((req, res) => {

    
})


module.exports = router;