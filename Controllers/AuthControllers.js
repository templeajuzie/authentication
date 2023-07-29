const User = require("../Model/UserSchema");
const userJoiSchema = require("../Model/UserSchema");
const jwt = require("jsonwebtoken");
require("dotenv");
const catchAssyncErrors = require("../Middlewares/catchAssyncErrors");
const ErrorHandler = require("../Utils/ErrorHandler");
const sendMail = require("../Utils/sendMail");

const secrete_key = process.env.SECRETE_KEY;

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, secrete_key, {
    expiresIn: maxAge,
  });
};

const handleErrors = (err) => {
  let errors = { email: "", password: "", username: "" };

  if (err.messase.includes("Email not registered")) {
    errors.email = "Email is not registered";
  }

  if (err.password.includes("incorrect password")) {
    errors.email = "incorrect password";
  }

  if (err.code === 11000) {
    errors.email = "Email already in use";
    return errors;
  } else if (err.code === 11000) {
    errors.username = "Username not available";
    return errors;
  }

  if (err.message.includes("User registration failed")) {
    Object.values(err.errors).forEach((properties) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;

  console.log(errors);
};

const userCreate = async (req, res, next) => {
  const { fullname, email, password, username, dob, img } = req.body;

  try {
    const realUserEmail = await User.findOne({ email });
    const realUserUsername = await User.findOne({ username });

    if (realUserEmail) {
      // return next(new ErrorHandler("user already exist with this email", 400))
      console.log("user already exist with this email");
      return res
        .status(200)
        .json({ message: "user already exist with this email" });
    } else if (realUserUsername) {
      // return next(new ErrorHandler("username already exist, choose a new one", 400))
      res
        .status(200)
        .json({ message: "this username is not available, choose a new one" });
      console.log("this username is not available, choose a new one");
    } else {
      const { error, value } = userJoiSchema.validate({
        fullname,
        email,
        password,
        username,
        dob,
        img,
      });

      if (error) {
        res.status(204).json({ message: "Invalid data type" });
      }

      const newuser = await User.create(value);

      const accesstoken = createToken(newuser._id);
      res.cookie("token", accesstoken, {
        withCredentials: true,
        httpOnly: false,
        maxAge: maxAge * 1000,
      });

      const activationUrl = `http://localhost:3000/activation/${accesstoken}`;

      res.status(201).json({
        id: newuser._id,
        email: newuser.email,
        fullname: newuser.fullname,
        username: newuser.username,
        dob: newuser.dob,
        img: newuser.img,
        message: "Congratulation, you now have a brand new account",
      });

      await sendMail({
        email: newuser.email,
        subject: "Activate your account",
        message: `Hello ${newuser.fullname} Thank you for signing up with Quickbaya! Please click the following link to confirm your e- mail address: ${activationUrl} }`,
      });
      // res.writeHead(301, { Location: 'index.html' });
      // res.end();

      console.log(newuser);
    }
  } catch (error) {
    res.status(400).json({ message: "Unable to create account" });
    // const errors = handleerrors(err);
  }
};

const userSignin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    console.log(email, password);

    const olduser = await User.findOne({ email });

    if (olduser) {
      const user = await User.login(email, password);

      const accesstoken = createToken(user._id);
      res.cookie("token", accesstoken, {
        withCredentials: true,
        httpOnly: false,
        maxAge: maxAge * 1000,
      });
      res.status(200).json({
        id: user._id,
        email: user.email,
        created: true,
        message: "account signin successfully",
      });

      console.log(user);
    } else {
      res
        .status(200)
        .json({ message: "invalid email or password, try again." });
    }
  } catch (error) {
    res.status(400).send(error);
    // const errors = handleErrors(err);
    res.json({ meesgae: "errors", created: false });
  }
};

const userRecovery = async (req, res, next) => {
  try {
    const { email } = req.body;

    const userexist = await User.findOne({ email });

    const accesstoken = createToken(userexist._id);
    res.cookie("jwt", accesstoken, {
      withCredentials: true,
      httpOnly: false,
      maxAge: maxAge * 1000,
    });

    const passwordUpdateUrl = `http://localhost:3000/client/updatepassword/${accesstoken}`;

    if (userexist) {
      await sendMail({
        email: userexist.email,
        subject: "Password Recovery",
        message: `Hello ${userexist.fullname}, Kindly click on this link below to update your password. ${passwordUpdateUrl}`,
      });
      res
        .status(201)
        .send({ message: `verification email has been sent to ${email}` });
      console.log(`verification email sent to ${email}`);
    } else {
      console.log(`${email}, is not registered`);
      res.status(204).send({ message: `${email}, is not registered` });
    }
  } catch (error) {
    res.status(500).send({ message: "Invalid user" });
    console.log("Error " + error.message);
  }
};

const userUpdatePassword = async (req, res, next) => {
  const { password, confirmpassword } = req.body;

  try {
    if (password !== confirmpassword) {
      console.log("password mismatch");
      return next(createCustomeErrors("Password does not match", 204));
    } else {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);

      const uUpdate = await User.findByIdAndUpdate(
        req.params.id,
        { password: hashedPassword },
        {
          new: true,
        }
      );

      return res.status(201).json({ data: uUpdate });
    }
  } catch (error) {}
};

const isAuthenticated = (req, res, next) => {};

module.exports = {
  handleErrors,
  userCreate,
  userSignin,
  userRecovery,
  userUpdatePassword,
  isAuthenticated,
};
