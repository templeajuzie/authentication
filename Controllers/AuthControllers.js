const User = require('../Model/UserSchema');
const userJoiSchema = require('../Utils/userJoiSchema');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
require('dotenv');
const CustomError = require('../Errors');

const secrete_key = process.env.SECRETE_KEY;

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, secrete_key, {
    expiresIn: maxAge,
  });
};

const userSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const olduser = await User.findOne({ email });

    if (olduser) {
      const authenticatedUser = await User.login(email, password);

      if (!authenticatedUser) {
        throw new CustomError.AuthenticationError(
          'Invalid email or password, try again.'
        );
      }

      const accesstoken = createToken(authenticatedUser._id);

      res.setHeader('Authorization', `Bearer ${accesstoken}`);

      console.log(accesstoken);

      res.status(StatusCodes.OK).json({
        token: accesstoken,
        user: {
          id: authenticatedUser._id,
          firstName: authenticatedUser.firstName,
          lastName: authenticatedUser.lastName,
        },
      });
    } else {
      throw new CustomError.AuthenticationError(
        'Invalid email or password, try again.'
      );
    }
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'An error occurred', created: false });
  }
};

const userCreate = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    passwordConfirm,
    carType,
    zipCode,
    city,
    country,
  } = req.body;

  try {
    const realUserEmail = await User.findOne({ email });

    if (realUserEmail) {
      throw new CustomError.AuthenticationError('Email already exists');
    }

    const { error, value } = userJoiSchema.validate({
      firstName,
      lastName,
      email,
      password,
      passwordConfirm,
      carType,
      zipCode,
      city,
      country,
    });

    if (error) {
      res.status(204).json({ message: 'Invalid data type' });
    }

    const newuser = await User.create(value);

    res.status(StatusCodes.CREATED).json({
      data: newuser,
    });
  } catch (error) {
    res.status(400).json({ message: 'Unable to create account' });
    // const errors = handleerrors(err);
  }
};

const currentUser = async (req, res) => {
  try {
    console.log('loading');
    if (req.user) {
      console.log('yes token is valid');
      return res.status(200).json({ data: req.user });
    }

    const error = new CustomError.validationError('User not found');
    error.statusCode = 404;
    error.name = 'NotFoundError'; // Custom property to distinguish not found errors
    throw error;
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

const userSignOut = async (req, res) => {
  try {
    res.cookie('token', '', { maxAge: 1 });
    res.status(StatusCodes.OK).json({ message: 'Signout successfully' });
  } catch (error) {
    res.status(400).send(error);
  }
};

const userUpdate = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    passwordConfirm,
    carType,
    zipCode,
    city,
    country,
  } = req.body;

  try {
    if (password !== confirmpassword) {
      throw new CustomError.AuthenticationError('Password does not match');
    } else {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);

      const uUpdate = await User.findByIdAndUpdate(
        req.params.id,
        {
          firstName,
          lastName,
          email,
          carType,
          zipCode,
          city: city,
          country: country,
          password: hashedPassword,
          passwordConfirm: hashedPassword,
        },
        {
          new: true,
        }
      );

      return res.status(StatusCodes.CREATED).json({ data: uUpdate });
    }
  } catch (error) {}
};

const userDelete = async (req, res) => {};

module.exports = {
  userCreate,
  userUpdate,
  currentUser,
  userSignOut,

  userSignIn,
  userDelete,
};
