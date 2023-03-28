
import fs from 'fs';
import ejs from 'ejs';
import {type ResetPasswordParamsInterface} from '@user/interfaces/user.interface';

class ResetPasswordTemplate {
	public passwordResetConfimationTemplate(templateParams: ResetPasswordParamsInterface): string {
		const {username, email, ipaddress, date} = templateParams;
		return ejs.render(fs.readFileSync(__dirname + '/reset-password-template.ejs', 'utf-8'), {
			username,
			email,
			ipaddress,
			date,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			image_url: './reset-password.png',
		});
	}
}

export const resetPasswordTemplate: ResetPasswordTemplate = new ResetPasswordTemplate();
