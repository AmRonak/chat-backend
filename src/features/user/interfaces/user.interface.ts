import {type Document} from 'mongoose';
import type mongoose from 'mongoose';
import {type ObjectId} from 'mongodb';

export type UserDocumentInterface = {
	_id: string | ObjectId;
	authId: string | ObjectId;
	username?: string;
	email?: string;
	password?: string;
	avatarColor?: string;
	uId?: string;
	postsCount: number;
	work: string;
	school: string;
	quote: string;
	location: string;
	blocked: mongoose.Types.ObjectId[];
	blockedBy: mongoose.Types.ObjectId[];
	followersCount: number;
	followingCount: number;
	notifications: NotificationSettingsInterface;
	social: SocialLinksInterface;
	bgImageVersion: string;
	bgImageId: string;
	profilePicture: string;
	createdAt?: Date;
} & Document;

export type ResetPasswordParamsInterface = {
	username: string;
	email: string;
	ipaddress: string;
	date: string;
};

export type NotificationSettingsInterface = {
	messages: boolean;
	reactions: boolean;
	comments: boolean;
	follows: boolean;
};

export type BasicInfoInterface = {
	quote: string;
	work: string;
	school: string;
	location: string;
};

export type SocialLinksInterface = {
	facebook: string;
	instagram: string;
	twitter: string;
	youtube: string;
};

export type SearchUserInterface = {
	_id: string;
	profilePicture: string;
	username: string;
	email: string;
	avatarColor: string;
};

export type SocketDataInterface = {
	blockedUser: string;
	blockedBy: string;
};

export type LoginInterface = {
	userId: string;
};

export type UserJobInfoInterface = {
	key?: string;
	value?: string | SocialLinksInterface;
};

export type UserJobInterface = {
	keyOne?: string;
	keyTwo?: string;
	key?: string;
	value?: string | NotificationSettingsInterface | UserDocumentInterface;
};

export type EmailJobInterface = {
	receiverEmail: string;
	template: string;
	subject: string;
};

export type AllUsersInterface = {
	users: UserDocumentInterface[];
	totalUsers: number;
};
