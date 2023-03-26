/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable @typescript-eslint/no-namespace */
import {type Document} from 'mongoose';
import {type ObjectId} from 'mongodb';
import {type UserDocumentInterface} from '@user/interfaces/user.interface';

declare global {
	namespace Express {
		interface Request {
			currentUser?: AuthPayload;
		}
	}
}

export type AuthPayload = {
	userId: string;
	uId: string;
	email: string;
	username: string;
	avatarColor: string;
	iat?: number;
};

export type AuthDocumentInterface = {
	_id: string | ObjectId;
	uId: string;
	username: string;
	email: string;
	password?: string;
	avatarColor: string;
	createdAt: Date;
	passwordResetToken?: string;
	passwordResetExpires?: number | string;
	comparePassword(password: string): Promise<boolean>;
	hashPassword(password: string): Promise<string>;
} & Document;

export type SignUpDataInterface = {
	_id: ObjectId;
	uId: string;
	email: string;
	username: string;
	password: string;
	avatarColor: string;
};

export type AuthJobInterface = {
	value?: string | AuthDocumentInterface | UserDocumentInterface ;
};
