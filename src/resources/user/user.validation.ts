import Joi from "joi";

const update = Joi.object({
    firstName: Joi.string().max(20),

    lastName: Joi.string().max(20)
})


export default { update }