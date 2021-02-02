const express = require("express");
const app = express();
const http = require("http");
const mongoose = require("mongoose");
const socketio = require("socket.io");
const server = http.Server(app);
const io = socketio(server);
const cors = require("cors");
require("dotenv").config();


///////////////////
const session = require("express-session");
const passport = require("passport");
const auth = require("./middlewares/auth");


//////////
const groupRoute = require("./routes/group");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");

let User = require("./models/user.model");

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_SERVER, // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true // allow session cookie from browser to pass through
  })
);
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
app.use("/group", auth, groupRoute);
app.use("/user", auth, userRoute);
app.use("/account", authRoute);

app.get("/", (req, res) => {
  res.send("Home route is okey!");

});




io.on("connection", (socket) => {
  console.log("a user is connected");
  console.log(socket)
})

server.listen(5000, () => { console.log("Server is listening on port 5000...") });

