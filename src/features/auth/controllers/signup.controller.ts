/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {ObjectId} from 'mongodb';
import HTTP_STATUS from 'http-status-codes';
import {joiValidation} from '@global/decorators/joi-validation.decorators';
import {signupSchema} from '@auth/schemas/signup.schema';
import {authService} from '@service/db/auth.service.db';
import {BadRequestError} from '@global/helpers/error-handler';
import {Helpers} from '@global/helpers/helpers';
import {uploads} from '@global/helpers/cloudinary-helpers';
import {type Request, type Response} from 'express';
import {type SignUpDataInterface, type AuthDocumentInterface} from '@auth/interfaces/auth.interface';
import {type UploadApiResponse} from 'cloudinary';
import {type UserDocumentInterface} from '@user/interfaces/user.interface';
import {UserCache} from '@service/redis/user.cache';
import {authQueue} from '@service/queues/auth.queue';
// Import {omit} from 'lodash';
import {userQueue} from '@service/queues/user.queue';
import JWT from 'jsonwebtoken';
import {config} from '@root/config';

const userCache: UserCache = new UserCache();

export class Signup {
	@joiValidation(signupSchema)
	public async create(req: Request, res: Response): Promise<void> {
		const {
			username,
			email,
			password,
			avatarImage,
			avatarColor,
		} = req.body;
		const checkIfUserExist: AuthDocumentInterface = await authService.getUserByUsernameOrEmail(username, email);
		if (checkIfUserExist) {
			throw new BadRequestError('User already exist');
		}

		const authObjectId = new ObjectId();
		const userObjectId = new ObjectId();
		const uId = `${Helpers.generateRandomIntegers(12)}`;
		const authData = Signup.prototype.signupData({
			_id: authObjectId,
			uId,
			username,
			avatarColor,
			email,
			password,
		});

		const result: UploadApiResponse = await uploads(avatarImage, `${userObjectId}`, true, true) as UploadApiResponse;
		if (!result?.public_id) {
			throw new BadRequestError('File upload: Error occured. Try again!');
		}

		// Add to redis cache
		const userDataForCache: UserDocumentInterface = Signup.prototype.userData(authData, userObjectId);
		userDataForCache.profilePicture = `https://res/cloudinary.com/dqzqnqvr3/image/upload/v${result.version}/${userObjectId}`;
		await userCache.saveUserToCache(`${userObjectId}`, uId, userDataForCache);

		// Add to database
		// omit(userDataForCache, ['uId', 'username', 'email', 'avatarColor', 'password']);
		authQueue.addAuthUserJob('addAuthUserToDB', {value: authData});
		userQueue.addUserJob('addUserToDB', {value: userDataForCache});

		const userJwt: string = Signup.prototype.signToken(authData, userObjectId);
		req.session = {jwt: userJwt};

		res.status(HTTP_STATUS.CREATED).json({message: 'User created successfully', user: userDataForCache, token: userJwt});
	}

	private signToken(userData: AuthDocumentInterface, userObjectId: ObjectId): string {
		return JWT.sign({
			userId: userObjectId,
			uId: userData.uId,
			email: userData.email,
			username: userData.username,
			avatarColor: userData.avatarColor,
		}, config.JWT_TOKEN!);
	}

	private signupData(data: SignUpDataInterface): AuthDocumentInterface {
		const {_id, avatarColor, email, password, uId, username} = data;
		return {
			_id,
			uId,
			username: Helpers.firstLetterUppercase(username),
			email: Helpers.lowercase(email),
			password,
			avatarColor,
			createdAt: new Date(),
		} as AuthDocumentInterface;
	}

	private userData(userData: AuthDocumentInterface, userObjectId: ObjectId): UserDocumentInterface {
		const {_id, username, email, uId, password, avatarColor} = userData;
		return {
			_id: userObjectId,
			authId: _id,
			uId,
			username: Helpers.firstLetterUppercase(username),
			email,
			password,
			avatarColor,
			profilePicture: '',
			blocked: [],
			blockedBy: [],
			work: '',
			location: '',
			school: '',
			quote: '',
			bgImageId: '',
			bgImageVersion: '',
			followersCount: 0,
			followingCount: 0,
			postsCount: 0,
			notifications: {
				messages: true,
				comments: true,
				follows: true,
				reactions: true,
			},
			social: {
				facebook: '',
				instagram: '',
				twitter: '',
				youtube: '',
			},
		} as unknown as UserDocumentInterface;
	}
}
