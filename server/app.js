const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = 5005;
const cors = require("cors");
const Cohort = require("./models/Cohort.model.js");
const Student = require("./models/Student.model.js");

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...
//const cohorts = require("./cohorts.json");
//const students = require("./students.json");

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



// | HTTP verb | URL                        | Request body | Action                                 |
// | GET       | `/api/cohorts`             | (empty)      | Returns all the cohorts in JSON format |
// | GET       | `/api/cohorts/:cohortId`   | (empty)      | Returns the specified cohort by id     |

app.get("/api/cohorts", (req, res) => {
  Cohort.find()
    .then((cohorts) => {
      res.json(cohorts);
    })
    .catch((e) => console.log(e, "error searching the cohorts"));
});

app.get("/api/cohorts/:cohortId", (req, res) => {
  const { cohortId } = req.params;
  
  Cohort.findById(cohortId)
    .then((cohort) => {
      res.json(cohort);
    })
    .catch((e) => console.log(e, "error searching the cohort by Id"));
});

// | HTTP verb | URL                               | Request body | Action                                                         |
// | --------- | --------------------------------- | ------------ | -------------------------------------------------------------- |
// | GET       | `/api/students`                   | (empty)      | Returns all the students in JSON format                        |
// | GET       | `/api/students/cohort/:cohortId`  | (empty)      | Returns all the students of a specified cohort in JSON format  |
// | GET       | `/api/students/:studentId`        | (empty)      | Returns the specified student by id                            |




app.get("/api/students", (req, res) => {
  Student.find({})
    .then((student) => {
      res.json(student);
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to retrieve students" });
    });
});


app.get("/api/students/cohort/:cohortId", (req, res) => {
  const { cohortId } = req.params;
  console.log(cohortId)
  Student.find({ cohort: cohortId })
    .populate("cohort","cohortName") // to retrieve cohortName from Cohort collection using cohort _id 
    .then((students) => {
      res.json(students);
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to retrieve students" });
    });
});


app.get("/api/students/:studentId", (req, res) => {
  const  {studentId} = req.params;

  Student.findById(studentId)
    .populate("cohort")
    .then((student) => {
      res.json(student);
    })
    .catch((e) => console.log(e, "error searching the student by Id"));
});

// | POST      | `/api/students`                   | JSON         | Creates a new student **with their respective cohort id**      |
// | PUT       | `/api/students/:studentId`        | JSON         | Updates the specified student by id                            |
// | DELETE    | `/api/students/:studentId`        | (empty)      | Deletes the specified cohort by id                             |

app.post("/api/students", (req, res, next) => {

  const newStudent = req.body;
  console.log(req)

  Student.create(newStudent)
      .then(student => {
          res.status(201).json(student);
      })
      .catch(error => {
          console.log("Error creating a new student in the DB...");
          console.log(error);
          res.status(500).json({ error: "Failed to create a new student" });
      })
})



// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
