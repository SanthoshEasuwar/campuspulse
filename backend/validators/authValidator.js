import Joi from "joi";

const vitStudentEmail = Joi.string()
  .trim()
  .lowercase()
  .email({ tlds: { allow: false } })
  .pattern(/^[a-zA-Z0-9._%+-]+@vitstudent\.ac\.in$/)
  .messages({
    "string.email": "Use a valid VIT student email",
    "string.pattern.base": "Only @vitstudent.ac.in accounts are allowed",
    "string.empty": "Email is required",
  });

export const signupSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  email: vitStudentEmail.required(),
  password: Joi.string().min(6).required(),
  bio: Joi.string().optional().allow(""),
  profilePicture: Joi.string().uri().optional().allow("")
});

export const loginSchema = Joi.object({
  email: vitStudentEmail.required(),
  password: Joi.string().required()
});
