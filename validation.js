var joi = require('@hapi/joi');

const registerValidation =(data)=>{
    let schema = joi.object({
        name:joi.string()
            .min(6)
            .required(),
        email:joi.string()
            .min(5)
            .required().email(),
        password:joi.string()
            .min(8) 
            .required(),
    })
    return schema.validate(data)
}

const loginValidation =(data)=>{
    let schema = joi.object({
        email:joi.string()
            .min(5)
            .required().email(),
        password:joi.string()
            .min(8) 
            .required()
    })
    return schema.validate(data)
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;