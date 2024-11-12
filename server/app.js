const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = 5005;
//const cohorts = require("./cohorts.json");
//const students = require("./students.json");
const cors = require("cors");
const Cohort = require("./models/Cohort.model.js");
const Student = require("./models/Student.model.js");

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);

// INITIALIZE MONGOOSE

const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then((x) => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch((err) => console.error("Error connecting to MongoDB", err));

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

app.get("/api/cohorts/:cohortId", (req, res) => {
  const { _id } = req.params;
  Cohort.findById(_id)
    .then((cohort) => {
      res.json(cohort);
    })
    .catch((e) => console.log(e, "error searching the cohort by Id"));
});

app.get("/api/students", (req, res) => {
  Student.find({})
    .then((students) => {
      res.json(students);
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to retrieve students" });
    });
});

//Adventure.findById(id).exec();

app.get("/api/students/:_id", (req, res) => {
  const { _id } = req.params;
  console.log("this is called id :", _id);
  console.log("this is type of id :", typeof _id);
  Student.findById(_id)
    .populate("cohort")
    .then((student) => {
      res.json(student);
    })
    .catch((e) => console.log(e, "error searching the student by Id"));
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
