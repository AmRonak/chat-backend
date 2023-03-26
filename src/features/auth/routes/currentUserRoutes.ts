/* eslint-disable new-cap */
import {CurrentUser} from '@auth/controllers/currentUser.controller';
import {authMiddleware} from '@global/helpers/auth-middleware';
import express, {type Router} from 'express';

class CurrentUserRoutes {
	private readonly router: Router;

	constructor() {
		this.router = express.Router();
	}

	public routes(): Router {
		this.router.get('/currentuser', authMiddleware.checkAuthentication, CurrentUser.prototype.read);
		return this.router;
	}
}

export const currentUserRoutes: CurrentUserRoutes = new CurrentUserRoutes();
