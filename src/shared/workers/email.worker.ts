/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {config} from '@root/config';
import {mailTransport} from '@service/emails/mail.transport';
import {type DoneCallback, type Job} from 'bull';
import type Logger from 'bunyan';

const log: Logger = config.createLogger('emailWorker');

class EmailWorker {
	async addNotificationEmail(job: Job, done: DoneCallback) {
		try {
			const {template, receiverEmail, subject} = job.data;
			await mailTransport.sendEmail(receiverEmail, subject, template);
			void job.progress(100);
			done(null, job.data);
		} catch (error) {
			log.error(error);
			done(error as Error);
		}
	}
}

export const emailWorker: EmailWorker = new EmailWorker();
