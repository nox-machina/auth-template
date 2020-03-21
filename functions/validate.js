const Joi = require('@hapi/joi');

const validateSignup = (data) => {
    const schema = Joi.object({
        password: Joi.string().min(6).required()
    });
    return schema.validate(data)
}

const trimVal = (val) => {
    return val.toLowerCase().trim().replace(/[^\w-]/g, '');
}

const trimCased = (val) => {
    return val.trim().replace(/\s+/g, ' ').replace(/[^\w- ]+/, "").replace(/\s+/g, " ");
}

module.exports.validateSignup = validateSignup;
module.exports.trimVal = trimVal;
module.exports.trimCased = trimCased;