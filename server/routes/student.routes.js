const router = require('express').Router();

const Student = require("../models/Student.model.js");


// | HTTP verb | URL                               | Request body | Action                                                         |
// | --------- | --------------------------------- | ------------ | -------------------------------------------------------------- |
// | GET       | `/api/students`                   | (empty)      | Returns all the students in JSON format                        |
// | GET       | `/api/students/cohort/:cohortId`  | (empty)      | Returns all the students of a specified cohort in JSON format  |
// | GET       | `/api/students/:studentId`        | (empty)      | Returns the specified student by id                            |




router.get("/api/students", (req, res) => {
    Student.find({})
      .then((student) => {
        res.json(student);
      })
      .catch((error) => {
        res.status(500).json({ error: "Failed to retrieve students" });
      });
  });
  
  
  router.get("/api/students/cohort/:cohortId", (req, res) => {
    const { cohortId } = req.params;
    console.log(cohortId)
    Student.find({ cohort : cohortId })
      .populate("cohort") // to retrieve cohortName from Cohort collection using cohort _id 
      .then((students) => {
        res.json(students);
      })
      .catch((error) => {
        res.status(500).json({ error: "Failed to retrieve students" });
      });
  });
  
  
  
  router.get("/api/students/:studentId", (req, res) => {
    const  {studentId} = req.params;
    console.log("req.params ---> ", req.params)
  
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
  
router.post("/api/students", (req, res, next) => {
  
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
  
 router.put("/api/students/:studentId", (req, res, next) => {
  
    const { studentId } = req.params;
  
    const newDetails = req.body;
  
    Student.findByIdAndUpdate(studentId, newDetails, { new: true })
        .then(studentFromDB => {
            res.json(studentFromDB);
        })
        .catch((error) => {
            console.error("Error updating student...");
            console.error(error);
            res.status(500).json({ error: "Failed to update a student" });
        });
  });
  
  
  router.delete("/api/students/:studentId", (req, res, next) => {
  
    const { studentId } = req.params;
  
    Student.findByIdAndDelete(studentId)
        .then(response => {
            res.json(response);
        })
        .catch((error) => {
            console.error("Error deleting student ...");
            console.error(error);
            res.status(500).json({ error: "Failed to delete a student" });
        });
  });

  module.exports = router;