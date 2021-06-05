const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");
const gravatar = require("gravatar");
/////////////////

const User = require("../../models/User");

router.post(
  "/",
  [
    check("name", "Name can't be empty").notEmpty(),
    check("email", "Enter a valid email").isEmail(),
    check(
      "password",
      "Password should be atleast 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, name, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ errors: [{ msg: "User already Registered" }] });
    }

    try {
      //create a new instance of user
      user = new User({ email, name, password });
      //get the gravatar for the user with his email
      user.avatar = gravatar.url(email, { s: 200, r: "pg", d: "mm" });
      //salt for hasing password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        id: user.id,
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) {
            console.error(err);
            return res.status(500).json("Server Error");
          }
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err);
      return res.status(500).json("Server Error");
    }
  }
);

module.exports = router;
