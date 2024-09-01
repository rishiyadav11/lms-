import Joi from 'joi';

export const courseSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    content: Joi.array().items(Joi.string()).required(),
    image: Joi.string().uri().optional(), // Validate the image URL
    videos: Joi.array()
});
