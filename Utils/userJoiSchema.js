const joi = require("joi");

const userJoiSchema = joi
  .object({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).max(30).required(),
    carType: joi.string().required(),
    zipCode: joi.string().required(),
    city: joi.string().required(),
    country: joi.string().required(),
  })
  .options({ abortEarly: false });

module.exports = userJoiSchema;
