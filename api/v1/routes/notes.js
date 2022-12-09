const express = require("express");
const router = express.Router();
const {
  getNotes,
  getSingleNote,
  createNotes,
  updateNotes,
  deleteNotes,
  notePhotoUpload,
} = require("../controllers/notes");

const Note = require("../models/Note");

const advancedResults = require("../middlewares/advancedResults");

const { protect, authorize } = require("../middlewares/auth");

router
  .route("/")
  .get(advancedResults(Note), getNotes)
  .post(protect, authorize("publisher"), createNotes);

router
  .route("/:id")
  .get(getSingleNote)
  .put(protect, authorize("publisher"), updateNotes)
  .delete(protect, authorize("publisher"), deleteNotes);

router
  .route("/:id/photo")
  .put(protect, authorize("publisher"), notePhotoUpload);

module.exports = router;
