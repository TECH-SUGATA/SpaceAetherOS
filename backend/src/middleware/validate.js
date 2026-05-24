// src/middleware/validate.js
const { validationResult } = require('express-validator');
const { errorResponse } = require('../utils/apiResponse');

const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    for (const validation of validations) {
      await validation.run(req);
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(
        res,
        'Validation failed',
        422,
        errors.array().map((e) => ({ field: e.path, message: e.msg }))
      );
    }
    next();
  };
};

module.exports = validate;
