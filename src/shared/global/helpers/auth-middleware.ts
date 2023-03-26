import {type AuthPayload} from '@auth/interfaces/auth.interface';
import {config} from '@root/config';
import {type NextFunction, type Request, type Response} from 'express';
import jwt from 'jsonwebtoken';
import {NotAuthorizedError} from './error-handler';

export class AuthMiddleware {
	public verifyUser(req: Request, res: Response, next: NextFunction): void {
		if (!req.session?.jwt) {
			throw new NotAuthorizedError('You\'re not logged in. Please login.');
		}

		try {
			const payload: AuthPayload = jwt.verify(req.session?.jwt, config.JWT_TOKEN!) as AuthPayload;
			req.currentUser = payload;
		} catch (error) {
			throw new NotAuthorizedError('You\'re not logged in. Please login.');
		}

		next();
	}

	public checkAuthentication(req: Request, res: Response, next: NextFunction): void {
		if (!req.currentUser) {
			throw new NotAuthorizedError('You\'re not logged in. Please login.');
		}

		next();
	}
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware();
