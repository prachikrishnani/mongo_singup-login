const router = require("express").Router();
const User = require("./../Schema/User");
const Joi = require("@hapi/joi");
const bcrypt = require("bcryptjs");

const schemaRegistration = Joi.object({
  name: Joi.string().min(6).required(),
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
});



router.post("/register", async (req, res) => {
  const { valid_user } = schemaRegistration.validate(req.body);
  if (valid_user) {
    return res.status(400).send("Please enter valid data");
  }

  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) {
    return res.send("email already exists...");
  }

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  console.log(user);

  try {
    const saveUser = await user.save();
    res.send(saveUser);
  } catch (error) {
    console.log(error);
  }
});



const schemaLogin = Joi.object({
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
});

router.post("/login", async (req, res) => {

  const { valid_user } = schemaLogin.validate(req.body);
  if (valid_user) {
    return res.status(400).send("Please enter valid data");
  }
  
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.send("Email not found");
  } else {
    const valid_email = await bcrypt.compare(req.body.email, user.email);
    const valid_pass = await bcrypt.compare(req.body.password, user.password);
    if (!valid_email && !valid_pass) {
      res.send("Successfully Logged IN.......");
    } else if (!valid_pass) {
      res.send("Invalid password");
    } else {
      res.send("Invalid User");
    }
  }
});

module.exports = router;
