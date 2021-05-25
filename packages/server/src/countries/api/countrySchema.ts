import Joi from "joi";

export const countrySchema = Joi.object({
    id: Joi.string(),
    name: Joi.string(),
    iso2: Joi.string().max(2),
    image: Joi.string(),
});
