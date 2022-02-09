import Joi from "joi";

export const eventSchema = Joi.object({
    id: Joi.string(),
    name: Joi.string(),
    typeId: Joi.string(),
    startDate: Joi.date(),
    endDate: Joi.date(),
    url: Joi.string().optional(),
});
