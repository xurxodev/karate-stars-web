import Joi from "joi";

export const eventTypeSchema = Joi.object({
    id: Joi.string(),
    name: Joi.string(),
});
