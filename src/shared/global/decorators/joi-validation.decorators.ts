/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {JoiRequestValidationError} from '@global/helpers/error-handler';
import {type Request} from 'express';
import {type ObjectSchema} from 'joi';

type JoiDecoratorType = (target: any, key: string, descriptor: PropertyDescriptor) => void;

export function joiValidation(schema: ObjectSchema): JoiDecoratorType {
	return (_target: any, _key: string, descriptor: PropertyDescriptor) => {
		const originalMethod = descriptor.value;

		descriptor.value = async function (...args: any[]) {
			const req: Request = args[0];
			const {error} = await Promise.resolve(schema.validate(req.body));
			if (error?.details) {
				throw new JoiRequestValidationError(error.details[0].message);
			}

			return originalMethod.apply(this, args);
		};

		return descriptor;
	};
}
