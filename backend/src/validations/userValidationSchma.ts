import Joi from 'joi';

// Define the Joi schema for user validation
const userSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    bgcolor: Joi.string().hex().length(7).optional(),  // Assuming hex color code with # prefix
    role: Joi.string().valid('student', 'instructor').required(),
    photo: Joi.string().uri().optional(),  // Validate as a URL or base64 string
});

// Example of validating user data
export const validateUser = (userData: any) => {
    return userSchema.validate(userData, { abortEarly: false });
};
