const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const User = require("../models/User");

//@desc Get All Users
//@route GET /api/v1/users
//@access Private/Admin

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//@desc Get Single User
//@route GET /api/v1/users/:id
//@access Private/Admin

exports.getSingleUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({ success: true, data: user });
});

//@desc Create user
//@route POST /api/v1/users/
//@access Private/Admin

exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({ success: true, data: user });
});

//@desc Update user
//@route PUT /api/v1/users/:id
//@access Private/Admin

exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({ success: true, data: user });
});

//@desc Delete user
//@route DELETE /api/v1/users/:id
//@access Private/Admin

exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, data: {} });
});
