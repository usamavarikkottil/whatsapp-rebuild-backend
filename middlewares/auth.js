const jwt = require('jsonwebtoken')
require("dotenv").config();

const auth = async function (req, res, next) {
    try {


        //Get auth header value
        const bearerHeader = req.headers['authorization'];
        //check if the bearer is undefined
        if (typeof bearerHeader !== "undefined") {

            //split at the space
            const bearer = bearerHeader.split(" ");
            //Get token from array
            const bearerToken = bearer[1];
            let decodedData;
            if (bearerToken) {
                decodedData = jwt.verify(bearerToken, process.env.JWT_SECRET);
            }
            //Set the token
            req.userId = decodedData.id;
            //next middleware
            next();

        } else {
            //forbidden
            res.status(403).send("Forbidden!!!!");
        }
    } catch (e) {
        res.status(403).json(e);
    }
}

module.exports = auth