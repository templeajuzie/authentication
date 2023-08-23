const User = require('../Model/UserSchema');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const secrete_key = process.env.SECRETE_KEY;

const checkUser = (req, res, next) => {
  console.log('loading again...');

  const auhtHeader = req.headers.authorization;
  const token = auhtHeader && auhtHeader.split(' ')[1];

  console.log('Token:', token);

  if (token) {
    jwt.verify(token, secrete_key, async (error, decodedtoken) => {
      if (error) {
        res.json({ status: false });
        next();
      }

      const user = await User.findById(decodedtoken.id);
      if (user) {
        res.json(user);
      } else {
        res.json({ status: false });
        next();
      }
    });
  } else {
    res.json({ status: false });
    // next();
  }
};

module.exports = checkUser;
