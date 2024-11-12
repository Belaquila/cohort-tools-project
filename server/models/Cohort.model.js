// ./models/Book.model.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// CREATE SCHEMA
// Schema - describes and enforces the structure of the documents
const cohortSchema = new Schema({
  _id: Number,
  inProgress: Boolean,
  cohortSlug: String,
  cohortName: String,
  format: String,
  program: String,
  campus: String,
  startDate: String,
  endDate: String,
  programManager: String,
  leadTeacher: String,
  totalHours: Number,
});

// CREATE MODELS

const Cohort = mongoose.model("Cohort", cohortSchema);

// EXPORT THE MODEL
module.exports = Cohort;
