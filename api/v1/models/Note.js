const mongoose = require("mongoose");
const slugify = require("slugify");

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
    maxlength: [100, "Title cannot be more than 100 characters"],
  },
  slug: String,
  noteBody: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  photo: {
    type: String,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

// Slugify middleware
NoteSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  this.noteLengthChars = parseInt(this.noteBody.length);
  next();
});

module.exports = mongoose.model("Note", NoteSchema);
