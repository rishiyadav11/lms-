import Joi from 'joi';

export const enrollmentValidationSchema = Joi.object({
    student: Joi.string().required(),
    course: Joi.string().required(),
});
