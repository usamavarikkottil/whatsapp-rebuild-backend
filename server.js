const express = require("express");
const app = express();
const http = require("http");
const server = http.Server(app);
const mongoose = require("mongoose");
const io = require("socket.io");


app.use(express.json());


app.get("/", (req, res) => {
    res.send("GOod boy...")
})





server.listen(5000, () => { console.log("Server is listening on port 5000...")});

