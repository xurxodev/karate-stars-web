import Joi from "joi";

export const categoryTypeSchema = Joi.object({
    id: Joi.string(),
    name: Joi.string(),
});
