/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {BaseCache} from '@service/redis/base.cache';
import type Logger from 'bunyan';
import {type UserDocumentInterface} from '@user/interfaces/user.interface';
import {config} from '@root/config';
import {ServerError} from '@global/helpers/error-handler';
import {Helpers} from '@global/helpers/helpers';

const log: Logger = config.createLogger('userCache');

export class UserCache extends BaseCache {
	constructor() {
		super('userCache');
	}

	public async saveUserToCache(key: string, userUId: string, createdUser: UserDocumentInterface): Promise<void> {
		const createdAt = new Date();
		const {
			_id,
			uId,
			username,
			email,
			avatarColor,
			blocked,
			blockedBy,
			postsCount,
			profilePicture,
			followersCount,
			followingCount,
			notifications,
			work,
			location,
			school,
			quote,
			bgImageId,
			bgImageVersion,
			social,
		} = createdUser;
		const firstList: string[] = [
			'_id',
			`${_id}`,
			'uId',
			`${uId}`,
			'username',
			`${username}`,
			'email',
			`${email}`,
			'avatarColor',
			`${avatarColor}`,
			'createdAt',
			`${createdAt}`,
			'postsCount',
			`${postsCount}`,
		];

		const secondList: string[] = [
			'blocked',
			JSON.stringify(blocked),
			'blockedBy',
			JSON.stringify(blockedBy),
			'profilePicture',
			`${profilePicture}`,
			'followersCount',
			`${followersCount}`,
			'followingCount',
			`${followingCount}`,
			'notifications',
			JSON.stringify(notifications),
			'social',
			JSON.stringify(social),
		];

		const thirdList: string[] = [
			'work',
			`${work}`,
			'location',
			`${location}`,
			'school',
			`${school}`,
			'quote',
			`${quote}`,
			'bgImageVersion',
			`${bgImageVersion}`,
			'bgImageId',
			`${bgImageId}`,
		];
		const dataToSave: string[] = [...firstList, ...secondList, ...thirdList];

		try {
			if (!this.client.isOpen) {
				await this.client.connect();
			}

			await this.client.ZADD('user', {score: parseInt(userUId, 10), value: `${key}`});
			await this.client.HSET(`users: ${key}`, dataToSave);
		} catch (error) {
			log.error(error);
			throw new ServerError('Server Error, Try again.');
		}
	}

	public async getUserFromCache(userId: string): Promise<UserDocumentInterface | undefined> {
		try {
			if (!this.client.isOpen) {
				await this.client.connect();
			}

			const response: UserDocumentInterface = await this.client.HGETALL(`users:${userId}`) as unknown as UserDocumentInterface;
			response.createdAt = new Date(Helpers.parseJson(`${response.createdAt}`));
			response.postsCount = Helpers.parseJson(`${response.postsCount}`);
			response.blocked = Helpers.parseJson(`${response.blocked}`);
			response.blockedBy = Helpers.parseJson(`${response.blockedBy}`);
			response.notifications = Helpers.parseJson(`${response.notifications}`);
			response.social = Helpers.parseJson(`${response.social}`);
			response.followersCount = Helpers.parseJson(`${response.followersCount}`);
			response.followingCount = Helpers.parseJson(`${response.followingCount}`);

			return response;
		} catch (error) {
			log.error(error);
			throw new ServerError('Server Error, Try again.');
		}
	}
}