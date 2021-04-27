import Joi from "joi";

export const videoLinkSchema = Joi.object({
    id: Joi.string(),
    type: Joi.string().valid("youtube", "facebook", "vimeo"),
});

export const videoSchema = Joi.object({
    id: Joi.string(),
    links: Joi.array().items(videoLinkSchema),
    title: Joi.string(),
    description: Joi.string(),
    subtitle: Joi.string(),
    competitors: Joi.array().items(Joi.string()),
    eventDate: Joi.date().iso(),
    createdDate: Joi.date().iso(),
    order: Joi.number(),
});
