const User = require("../Model/UserSchema");
const userJoiSchema = require("../Utils/userJoiSchema");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
require("dotenv");
const sendMail = require("../Utils/sendMail");
const CustomError = require("../Errors");

const secrete_key = process.env.SECRETE_KEY;

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, secrete_key, {
    expiresIn: maxAge,
  });
};

const userCreate = async (req, res, next) => {
  const { fullname, email, password, username, dob, img } = req.body;

  try {
    const realUserEmail = await User.findOne({ email });
    const realUserUsername = await User.findOne({ username });

    if (realUserEmail) {
      throw new CustomError.AuthenticationError("Email already exists");
    } else if (realUserUsername) {
      // return next(new ErrorHandler("username already exist, choose a new one", 400))
      throw new CustomError.AuthenticationError("username already exists");
    }

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
    res.cookie("token", `Bearer ${accesstoken}`, {
      withCredentials: true,
      httpOnly: false,
      maxAge: maxAge * 1000,
    });

    const activationUrl = `http://localhost:3000/activation/${accesstoken}`;

    res.status(StatusCodes.CREATED).json({
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
  } catch (error) {
    res.status(400).json({ message: "Unable to create account" });
    // const errors = handleerrors(err);
  }
};

const userSignin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const olduser = await User.findOne({ email });

    if (olduser) {
      const user = await User.login(email, password);

      const accesstoken = createToken(user._id);
      res.cookie("token", `Bearer ${accesstoken}`, {
        withCredentials: true,
        httpOnly: false,
        maxAge: maxAge * 1000,
      });
      res.status(StatusCodes.OK).json({
        id: user._id,
        email: user.email,
        created: true,
        message: "account signin successfully",
      });
    } else {
      throw new CustomError.AuthenticationError(
        "invalid email or password, try again."
      );
    }
  } catch (error) {
    res.status(400).send(error);
    // const errors = handleErrors(err);
    res.json({ meesgae: "errors", created: false });
  }
};

const singleUser = async (req, res, next) => {
  const id = req.params.id;

  try {
    const checkUser = await User.findById(id);

    if (checkUser) {
      return res.status(200).json({ data: checkUser });
    }

    const error = new CustomError.validationError("User not found");
    error.statusCode = 404;
    error.name = "NotFoundError"; // Custom property to distinguish not found errors
    throw error;
    
  } catch (error) {}
};

const userRecovery = async (req, res, next) => {
  try {
    const { email } = req.body;

    const userexist = await User.findOne({ email });

    const accesstoken = createToken(userexist._id);
    res.cookie("jwt", `Bearer ${accesstoken}`, {
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
        .status(StatusCodes.OK)
        .send({ message: `verification email has been sent to ${email}` });
      console.log(`verification email sent to ${email}`);
    } else {
      throw new CustomError.AuthenticationError(`${email}, is not registered`);
    }
  } catch (error) {
    res.status(500).send({ error: error });
    console.log("Error " + error.message);
  }
};

const userUpdatePassword = async (req, res, next) => {
  const { password, confirmpassword } = req.body;

  try {
    if (password !== confirmpassword) {
      throw new CustomError.AuthenticationError("Password does not match");
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

      return res.status(StatusCodes.CREATED).json({ data: uUpdate });
    }
  } catch (error) {}
};

const isAuthenticated = (req, res, next) => {};

module.exports = {
  userCreate,
  userSignin,
  userRecovery,
  userUpdatePassword,
  isAuthenticated,
  singleUser,
};
