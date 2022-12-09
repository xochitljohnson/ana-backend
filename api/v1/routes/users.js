const express = require("express");
const {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");

const User = require("../models/User");

const router = express.Router({ mergeParams: true });

const advancedResults = require("../middlewares/advancedResults");
const { protect, authorize } = require("../middlewares/auth");

router.use(protect);
router.use(authorize("admin"));

router.route("/").get(advancedResults(User), getAllUsers).post(createUser);

router.route("/:id").get(getSingleUser).put(updateUser).delete(deleteUser);

module.exports = router;
