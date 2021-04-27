import Joi from "joi";

export const newsFeedSchema = Joi.object({
    id: Joi.string(),
    name: Joi.string(),
    language: Joi.string(),
    type: Joi.string().valid("rss", "atom"),
    image: Joi.string(),
    url: Joi.string(),
});
