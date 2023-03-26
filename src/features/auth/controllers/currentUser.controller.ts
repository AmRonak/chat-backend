/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
import {userService} from '@service/db/user.service.db';
import {UserCache} from '@service/redis/user.cache';
import {type UserDocumentInterface} from '@user/interfaces/user.interface';
import {type Request, type Response} from 'express';
import HTTP_STATUS from 'http-status-codes';

export class CurrentUser {
	public async read(req: Request, res: Response): Promise<void> {
		const userCache = new UserCache();
		let isUser = false;
		let token = null;
		let user = null;

		const cacheUser: UserDocumentInterface = await userCache.getUserFromCache(`${req.currentUser!.userId}`) as UserDocumentInterface;
		const existingUser: UserDocumentInterface = cacheUser ? cacheUser : await userService.getUserById(`${req.currentUser!.userId}`);
		if (Object.keys(existingUser).length) {
			isUser = true;
			token = req.session?.jwt;
			user = existingUser;
		}

		res.status(HTTP_STATUS.OK).json({token, user, isUser});
	}
}
