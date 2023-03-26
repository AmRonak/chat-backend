/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {type AuthDocumentInterface} from '@auth/interfaces/auth.interface';
import {loginSchema} from '@auth/schemas/signin.schema';
import {joiValidation} from '@global/decorators/joi-validation.decorators';
import {BadRequestError} from '@global/helpers/error-handler';
import {config} from '@root/config';
import {authService} from '@service/db/auth.service.db';
import {Request, Response} from 'express';
import JWT from 'jsonwebtoken';
import HTTP_STATUS from 'http-status-codes';
import {userService} from '@service/db/user.service.db';
import {type UserDocumentInterface} from '@user/interfaces/user.interface';

export class SignIn {
	@joiValidation(loginSchema)
	public async read(req: Request, res: Response): Promise<void> {
		const {username, password} = req.body;
		const checkIfUserExist: AuthDocumentInterface = await authService.getAuthUserByUsername(username);
		if (!checkIfUserExist) {
			throw new BadRequestError('Invalid Credentials');
		}

		const passwordMatch: boolean = await checkIfUserExist.comparePassword(password);
		if (!passwordMatch) {
			throw new BadRequestError('Invalid Credentials');
		}

		const user = await userService.getUserByAuthId(checkIfUserExist.id);
		const userJwt = JWT.sign({
			userId: checkIfUserExist._id,
			uId: checkIfUserExist.uId,
			email: checkIfUserExist.email,
			username: checkIfUserExist.username,
			avatarColor: checkIfUserExist.avatarColor,
		}, config.JWT_TOKEN!);

		req.session = {jwt: userJwt};
		const userDocument: UserDocumentInterface = {
			...user,
			authId: checkIfUserExist._id,
			username: checkIfUserExist.username,
			email: checkIfUserExist.email,
			avatarColor: checkIfUserExist.avatarColor,
			uId: checkIfUserExist.uId,
			createdAt: checkIfUserExist.createdAt,
		} as UserDocumentInterface;
		res.status(HTTP_STATUS.OK).json({message: 'User login successfully', user: userDocument, token: userJwt});
	}
}
