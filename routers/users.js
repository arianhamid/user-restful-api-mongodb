const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require("../models/user");
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
  //get all users from Users document
  const users = await User.find();
  res.json({ data: users, message: "ok" });
});

router.get("/:id", async (req, res) => {
  // check if ObjectId that was passed in is valid
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).json({ data: null, message: "invalid id" });
  const user = await User.findById(req.params.id);
  if (!user)
    return res.status(404).json({ data: null, message: "user not found" });
  res.json({
    data: user,
    message: "ok",
  });
});

router.post(
  "/",
  [
    body("email", "email must be valid").isEmail(),
    body("first_name", "first_name cant be empty").notEmpty(),
    body("last_name", "last name cant be empty").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json({ errors: errors.array(), message: "validation failed" });
    }
    let newUser = new User({
      name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
      age: req.body.age,
    });
    newUser = await newUser.save();
    res.json({ data: newUser, message: "ok" });
  }
);

router.put(
  "/:id",
  [
    body("email", "email must be valid").isEmail(),
    body("first_name", "first_name cant be empty").notEmpty(),
    body("last_name", "last name cant be empty").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json({ errors: errors.array(), message: "validation failed" });
    }
    // check if ObjectId that was passed in is valid
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ data: null, message: "invalid id" });
    let user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        // admin: req.body.admin,
        // age: req.body.age,
      },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ data: null, message: "user not found" });
    }
    res.json({ data: user, message: "user updated" });
  }
);

// validate incoming requests
router.delete("/:id", async (req, res) => {
  // check if ObjectId that was passed in is valid
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).json({ data: null, message: "invalid id" });
  const user = await User.findByIdAndRemove(req.params.id);
  if (!user) {
    return res.status(404).json({ data: null, message: "user not found" });
  }

  res.json({ data: user, message: "user deleted" });
});

module.exports = router;
