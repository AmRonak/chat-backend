/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {type AuthDocumentInterface} from '@auth/interfaces/auth.interface';
import {emailSchema, passwordSchema} from '@auth/schemas/password.schema';
import {joiValidation} from '@global/decorators/joi-validation.decorators';
import {BadRequestError} from '@global/helpers/error-handler';
import {authService} from '@service/db/auth.service.db';
import {Request, Response} from 'express';
import HTTP_STATUS from 'http-status-codes';
import crypto from 'crypto';
import {config} from '@root/config';
import {forgotPasswordTemplate} from '@service/emails/templates/forgot-password/forgot-password';
import {emailQueue} from '@service/queues/email.queue';
import {type ResetPasswordParamsInterface} from '@user/interfaces/user.interface';
import publicIP from 'ip';
import {resetPasswordTemplate} from '@service/emails/templates/reset-password/reset-password';
import moment from 'moment';

export class Password {
	@joiValidation(emailSchema)
	public async create(req: Request, res: Response): Promise<void> {
		const {email} = req.body;
		const existingUser: AuthDocumentInterface = await authService.getAuthUserByEmail(email);
		if (!existingUser) {
			throw new BadRequestError('Invalid Credentials');
		}

		const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
		const randomCharacters: string = randomBytes.toString('hex');

		await authService.updatePasswordToke(existingUser.id, randomCharacters, Date.now() * 60 * 60 * 1000);
		const resetLink = `${config.CLIENT_URL!}/reset-password?token=${randomCharacters}`;
		const template: string = forgotPasswordTemplate.passwordResetTemplate(existingUser.username, resetLink);
		emailQueue.addEmailJob('forgotPasswordEmail', {template, receiverEmail: email, subject: 'Reset your password'});
		res.status(HTTP_STATUS.OK).json({
			message: 'Password reset email sent',
		});
	}

	@joiValidation(passwordSchema)
	public async update(req: Request, res: Response): Promise<void> {
		const {password, confirmPassowrd} = req.body;
		const {token} = req.params;
		const existingUser: AuthDocumentInterface = await authService.getAuthUserByPasswordToken(token);
		if (!existingUser) {
			throw new BadRequestError('Reset password link has expired.');
		}

		existingUser.password = password;
		existingUser.passwordResetExpires = undefined;
		existingUser.passwordResetToken = undefined;

		await existingUser.save();

		const templateParams: ResetPasswordParamsInterface = {
			username: existingUser.username,
			email: existingUser.email,
			ipaddress: publicIP.address(),
			date: moment().format('DD/MM/YYYY HH:mm'),
		};

		const template: string = resetPasswordTemplate.passwordResetConfimationTemplate(templateParams);
		emailQueue.addEmailJob('forgotPasswordEmail', {template, receiverEmail: existingUser.email, subject: 'Password Reset confirmation'});
		res.status(HTTP_STATUS.OK).json({
			message: 'Password successfully updated',
		});
	}
}
