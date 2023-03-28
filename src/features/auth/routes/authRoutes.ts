/* eslint-disable new-cap */
import {Password} from '@auth/controllers/password';
import {SignIn} from '@auth/controllers/signin.controller';
import {SignOut} from '@auth/controllers/signout.controller';
import {Signup} from '@auth/controllers/signup.controller';
import express, {type Router} from 'express';

class AuthRoutes {
	private readonly router: Router;

	constructor() {
		this.router = express.Router();
	}

	public routes(): Router {
		this.router.post('/signup', Signup.prototype.create);
		this.router.post('/signin', SignIn.prototype.read);
		this.router.post('/forgot-password', Password.prototype.create);
		this.router.post('/reset-password/:token', Password.prototype.update);
		return this.router;
	}

	public signOutRoutes(): Router {
		this.router.get('/signout', SignOut.prototype.update);
		return this.router;
	}
}

export const authRoutes: AuthRoutes = new AuthRoutes();
