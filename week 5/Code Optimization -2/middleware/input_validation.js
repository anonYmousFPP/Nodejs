const Joi = require('joi');

const userSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    age: Joi.number().integer().min(18).max(120),
    email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net'] }
    }).required().messages({
        'string.email': 'Please provide a valid email ending with .com or .net',
        'any.required': 'Email is required'
    }),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required()
        .messages({
            'string.pattern.base': 'Password must be 3-30 alphanumeric characters',
            'any.required': 'Password is required'
        }),
    phoneNumber: Joi.string().pattern(new RegExp('^[0-9]{10,15}$'))
        .messages({
            'string.pattern.base': 'Phone number must be 10-15 digits'
        })
}).with('name', 'age');

const validateUser = (req, res, next) => {
    const { error, value } = userSchema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      return res.status(400).json({ errors: errorMessages });
    }
    req.validatedData = value;
    next();
};

module.exports = validateUser;