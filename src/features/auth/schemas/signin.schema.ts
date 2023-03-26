/* eslint-disable @typescript-eslint/naming-convention */
import Joi, {type ObjectSchema} from 'joi';

export const loginSchema: ObjectSchema = Joi.object().keys({
	username: Joi.string().required().min(4).max(20).messages({
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
});
