import Joi from "joi";

export const socialLinkSchema = Joi.object({
    url: Joi.string(),
    type: Joi.string().valid("web", "twitter", "facebook", "instagram"),
});

export const achievementSchema = Joi.object({
    eventId: Joi.string(),
    categoryId: Joi.string(),
    position: Joi.number(),
});

export const competitorSchema = Joi.object({
    id: Joi.string(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    wkfId: Joi.string(),
    biography: Joi.string(),
    countryId: Joi.string(),
    categoryId: Joi.string(),
    mainImage: Joi.string(),
    isActive: Joi.boolean(),
    isLegend: Joi.boolean(),
    links: Joi.array().items(socialLinkSchema),
    achievements: Joi.array().items(achievementSchema),
});
