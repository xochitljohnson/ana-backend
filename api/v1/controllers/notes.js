const path = require("path");
const Notes = require("../models/Note");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");

//@desc Get all notes
//@route GET /api/v1/notes
//@access Public
exports.getNotes = asyncHandler(async (req, res, next) => {
  // response
  res.status(200).json(res.advancedResults);
});

//@desc Get single notes
//@route GET /api/v1/notes/:id
//@access Public
exports.getSingleNote = asyncHandler(async (req, res, next) => {
  const getSingleNote = await Notes.findById(req.params.id);

  if (!getSingleNote) {
    return next(
      new ErrorResponse(`Note not found with ID: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: getSingleNote });
});

//@desc Create new notes
//@route POST /api/v1/notes
//@access Auth
exports.createNotes = asyncHandler(async (req, res, next) => {
  // relate to user
  req.body.user = req.user.id;

  const newNote = await Notes.create(req.body);

  res
    .status(201)
    .json({ success: true, data: newNote, noteLength: newNote.length });
});

//@desc Update note
//@route PUT /api/v1/notes/:id
//@access Auth
exports.updateNotes = asyncHandler(async (req, res, next) => {
  let updatedNote = await Notes.findById(req.params.id);

  if (!updatedNote) {
    return next(
      new ErrorResponse(`Note not found with ID: ${req.params.id}`, 404)
    );
  }

  // make sure user is note owner

  if (updatedNote.user.toString() !== req.user.id && req.user.role !== "user") {
    return next(
      new ErrorResponse(
        `User ${req.param.id} is not authorized to update note`,
        404
      )
    );
  }

  updatedNote = await Notes.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: updatedNote });
});

//@desc  Upload photo to note
//@route PUT /api/v1/notes/:id/photo
//@access Private
exports.notePhotoUpload = asyncHandler(async (req, res, next) => {
  const updatedNote = await Notes.findById(req.params.id);

  if (!updatedNote) {
    return new ErrorResponse(`Note not found with ID: ${req.params.id}`, 404);
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;
  // make sure it's photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // create custom file name
  file.name = `photo_${updatedNote.id}${path.parse(file.name).ext}`;

  // upload file
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Notes.findByIdAndUpdate(req.params.id, { photo: file.name });
    res.status(200).json({ success: true, data: file.name });
  });
});

//@desc Delete note
//@route DELETE /api/v1/notes/:id
//@access Auth
exports.deleteNotes = asyncHandler(async (req, res, next) => {
  const deleteNote = await Notes.findByIdAndDelete(req.params.id);

  if (!deleteNote) {
    return next(
      new ErrorResponse(`Note not found with ID: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: {} });
});
