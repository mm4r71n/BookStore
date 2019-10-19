const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/", (req, res) => {
  res.render("user/index");
});

router.get("/register", (req, res) => {
  res.render("user/register");
});

//new user route
// router.get("/register", (req, res) => {
//   renderNewPage(res, new User());
// });

//create user route
router.post("/register", async (req, res) => {
  //   console.log(`user is ${req.body.username}`);
  const user = new User({
    name: req.body.name,
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    address: req.body.address,
    credit_card: req.body.creditcard
  });

  try {
    const newUser = await user.save();
    console.log("user added!");
    res.redirect("/");
  } catch (e) {
    console.log(e);
    res.render("/");
  }
});

module.exports = router;
