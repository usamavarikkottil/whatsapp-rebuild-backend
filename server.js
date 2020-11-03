const express = require("express");
const app = express();
const http = require("http");
const server = http.Server(app);
const mongoose = require("mongoose");
const io = require("socket.io");
const groupRoute = require("./routes/group");


app.use(express.json());

// DB connection
mongoose.connect("mongodb://localhost:27017/whatsappDB", {useNewUrlParser: true,useCreateIndex: true});
const connection = mongoose.connection;
connection.once('open', () => {console.log("MongoDB connection success :D ")});


// Routes
app.use("/group", groupRoute);

app.get("/", (req, res) => {
    res.send("GOod boy...")
})





server.listen(5000, () => { console.log("Server is listening on port 5000...")});

