const joi = require("joi");

const userJoiSchema = joi
  .object({
    fullname: joi.string().required(),
    username: joi.string().alphanum().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).max(30).required(),
    dob: joi.string().required(),
    img: joi.string(),
  })
  .options({ abortEarly: false });

module.exports = userJoiSchema;
