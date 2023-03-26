/* eslint-disable @typescript-eslint/naming-convention */
import Joi, {type ObjectSchema} from 'joi';

export const signupSchema: ObjectSchema = Joi.object().keys({
	username: Joi.string().required().min(4).max(16).messages({
		'string.base': 'Username must be of type string',
		'string.min': 'Username name cant be less than 4 character',
		'string.max': 'Username name cant be more than 16 character',
		'string.empty': 'Username is a required field',
	}),
	password: Joi.string().required().min(4).max(8).messages({
		'string.base': 'Password must be of type string',
		'string.min': 'Invalid pasword',
		'string.max': 'Invalid pasword',
		'string.empty': 'Password is a required field',
	}),
	email: Joi.string().email().required().messages({
		'string.base': 'Email must be of type string',
		'string.email': 'email must be valid',
		'string.empty': 'Email is a required field',
	}),
	avatarColor: Joi.string().required().messages({
		'any.required': 'Avatar color is required',
	}),
	avatarImage: Joi.string().required().messages({
		'any.required': 'Avatar image is required',
	}),
});
