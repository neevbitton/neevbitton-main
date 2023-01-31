import Joi from "joi";

const register = Joi.object({
    email: Joi.string().email().required(),

    password: Joi.string().min(6).required(),

    firstName: Joi.string().max(20).required(),

    lastName: Joi.string().max(20).required()
})

const login = Joi.object({
    email: Joi.string().email().required(),

    password: Joi.string().min(6).required()
})

export default { register, login }