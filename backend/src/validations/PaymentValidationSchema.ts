import Joi from 'joi';

export const paymentValidationSchema = Joi.object({
    student: Joi.string().required(),
    course: Joi.string().required(),
    amount: Joi.number().min(0).required(),
    paymentDate: Joi.date().default(Date.now),
});
