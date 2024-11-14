const router = require("express").Router();

const Cohort = require("../models/Cohort.model.js");


// | HTTP verb | URL                        | Request body | Action                                 |
// | GET       | `/api/cohorts`             | (empty)      | Returns all the cohorts in JSON format |
// | GET       | `/api/cohorts/:cohortId`   | (empty)      | Returns the specified cohort by id     |

router.get("/api/cohorts", (req, res) => {
    Cohort.find()
      .then((cohorts) => {
        res.json(cohorts);
      })
      .catch((e) => console.log(e, "error searching the cohorts"));
  });
  
  router.get("/api/cohorts/:cohortId", (req, res) => {
    const { cohortId } = req.params;
    
    Cohort.findById(cohortId)
      .then((cohort) => {
        res.json(cohort);
      })
      .catch((e) => console.log(e, "error searching the cohort by Id"));
  });
  
  
  // | HTTP verb | URL                        | Request body | Action                                 |
  // | --------- | -------------------------- | ------------ | -------------------------------------- |
  // | POST      | `/api/cohorts`             | JSON         | Creates a new cohort                   |
  // | PUT       | `/api/cohorts/:cohortId`   | JSON         | Updates the specified cohort by id     |
  // | DELETE    | `/api/cohorts/:cohortId`   | (empty)      | Deletes the specified cohort by id     |
  
  router.post("/api/cohorts", (req, res) => {
    
    const newCohort = req.body;
    console.log(req)
  
    Cohort.create(newCohort)
    .then(cohort => {
        res.status(201).json(cohort);
    })
    .catch(error => {
        console.log("Error creating a new cohort in the DB...");
        console.log(error);
        res.status(500).json({ error: "Failed to create a new cohort" });
    })
  });
  
  
  
  router.put("/api/cohorts/:cohortId", (req, res, next) => {
  
    const { cohortId } = req.params;
  
    const newDetails = req.body;
  
    Cohort.findByIdAndUpdate(cohortId, newDetails, { new: true })
        .then(cohort => {
            res.json(cohort);
        })
        .catch((error) => {
            console.error("Error updating cohort...");
            console.error(error);
            res.status(500).json({ error: "Failed to update a cohort" });
        });
  });
  
  
  router.delete("/api/cohorts/:cohortId", (req, res, next) => {
  
    const { cohortId } = req.params;
  
    Cohort.findByIdAndDelete(cohortId)
        .then(cohort => {
            res.json(cohort);
        })
        .catch((error) => {
            console.error("Error deleting cohort ...");
            console.error(error);
            res.status(500).json({ error: "Failed to delete a cohort" });
        });
  });

  module.exports = router;