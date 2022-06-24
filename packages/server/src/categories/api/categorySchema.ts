import Joi from "joi";

export const categorySchema = Joi.object({
    id: Joi.string(),
    name: Joi.string(),
    typeId: Joi.string(),
    wkfId: Joi.string().allow(null),
    paraKarate: Joi.boolean(),
    main: Joi.boolean(),
});
