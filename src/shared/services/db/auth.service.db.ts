import {type AuthDocumentInterface} from '@auth/interfaces/auth.interface';
import {AuthModel} from '@auth/schemas/auth.schema';
import {Helpers} from '@global/helpers/helpers';

class AuthService {
	public async createAuthUser(data: AuthDocumentInterface): Promise<void> {
		await AuthModel.create(data);
	}

	public async updatePasswordToke(authId: string, token: string, tokenExpiration: number): Promise<void> {
		await AuthModel.updateOne({_id: authId}, {
			passwordResetToken: token,
			passwordResetExpires: tokenExpiration,
		});
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

	public async getAuthUserByEmail(email: string): Promise<AuthDocumentInterface> {
		const user: AuthDocumentInterface = await AuthModel.findOne({email: Helpers.lowercase(email)}).exec() as AuthDocumentInterface;
		return user;
	}

	public async getAuthUserByPasswordToken(token: string): Promise<AuthDocumentInterface> {
		const user: AuthDocumentInterface = await AuthModel.findOne({
			passwordResetToken: token,
			passwordResetExpires: {$gt: Date.now()},
		}).exec() as AuthDocumentInterface;
		return user;
	}
}

export const authService: AuthService = new AuthService();
