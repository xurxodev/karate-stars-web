import Joi from "joi";

export const eventSchema = Joi.object({
    id: Joi.string(),
    name: Joi.string(),
    year: Joi.number(),
    typeId: Joi.string(),
});
