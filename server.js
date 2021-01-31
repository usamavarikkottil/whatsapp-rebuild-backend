const express = require("express");
const app = express();
const http = require("http");
const mongoose = require("mongoose");
const socketio = require("socket.io");
const server = http.Server(app);
const io = socketio(server);
const cors = require("cors");
///////////////////
const session = require("express-session");
const passport = require("passport");

//////////
const groupRoute = require("./routes/group");
const userRoute = require("./routes/user");

let User = require("./models/user.model");

app.use(express.json());
app.use(cors());
app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// DB connection
mongoose.connect("mongodb://localhost:27017/whatsappDB", { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => { console.log("MongoDB connection success :D ") });



// Routes
app.use("/group", groupRoute);
app.use("/user", userRoute);

app.get("/", (req, res) => {
  res.send("Home route is okey!");

});




io.on("connection", (socket) => {
  console.log("a user is connected");
  console.log(socket)
})

server.listen(5000, () => { console.log("Server is listening on port 5000...") });

