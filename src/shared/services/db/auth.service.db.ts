/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {type AuthDocumentInterface} from '@auth/interfaces/auth.interface';
import {AuthModel} from '@auth/schemas/auth.schema';
import {Helpers} from '@global/helpers/helpers';

class AuthService {
	public async createAuthUser(data: AuthDocumentInterface): Promise<void> {
		await AuthModel.create(data);
	}

	public async getUserByUsernameOrEmail(username: string, email: string): Promise<AuthDocumentInterface> {
		const query = {
			$or: [
				{username: Helpers.firstLetterUppercase(username)},
				{email: Helpers.lowercase(email)},
			],
		};
		const user: AuthDocumentInterface = await AuthModel.findOne(query).exec() as AuthDocumentInterface;
		return user;
	}

	public async getAuthUserByUsername(username: string): Promise<AuthDocumentInterface> {
		const user: AuthDocumentInterface = await AuthModel.findOne({username: Helpers.firstLetterUppercase(username)}).exec() as AuthDocumentInterface;
		return user;
	}
}

export const authService: AuthService = new AuthService();
