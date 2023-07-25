const {check,validationResult} = require('express-validator');

exports.validateUserSignUp = [
    check('name')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Please insert a name')
    .isString()
    .withMessage('name should be valid')
    .isLength({ min: 3, max: 20 })
    .withMessage('Name should be within 3 to 20 characters'),
  check('email').normalizeEmail().isEmail().withMessage('Invalid email'),
  check('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Password should not be empty')
    .isLength({ min: 8, max: 20 })
    .withMessage('Password should be 3 to 20 characters long'),
  check('confirmPassword')
    .trim()
    .not()
    .isEmpty()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('the passwords does not match');
      }
      return true;
    }),
];

exports.userValidation = (req,res,next)=>{
    const result = validationResult(req).array();
    if(!result.length) return next();

    const error = result[0].msg;
    res.json({success: false,message: error});
}