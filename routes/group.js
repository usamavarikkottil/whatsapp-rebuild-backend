const router = require("express").Router();
let Group = require("../models/group.model");


router.route("/new").post((req , res) => {
    const groupName = req.body.groupName;
    const photoUrl = req.body.photoUrl;
    const newGroup = new Group({groupName, photoUrl});

    newGroup.save()
    .then(() => res.json("New Group created Succefully!"))
    .catch((err) =>  res.status(400).json(`Error ${err}`))
});

router.route("/groups").get((req, res) => {
    Group.find()
    .then(groups => res.json(groups))
    .catch(error => res.status(400).json(error))

})

module.exports = router;