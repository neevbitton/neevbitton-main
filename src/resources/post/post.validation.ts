import Joi from "joi";

const create = Joi.object({
    title: Joi.string(),

    description: Joi.string().max(1000),

    url: Joi.string().required()
})

const update = Joi.object({
    title: Joi.string(),

    description: Joi.string().max(1000),

    url: Joi.string()
})

const favorite = Joi.object({
    postId: Joi.string().required()
})


export default { create, update, favorite }