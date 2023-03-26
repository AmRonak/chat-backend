/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {config} from '@root/config';
import {authService} from '@service/db/auth.service.db';
import {type DoneCallback, type Job} from 'bull';
import type Logger from 'bunyan';

const log: Logger = config.createLogger('authWorker');

class AuthWorker {
	async addAuthUserToDb(job: Job, done: DoneCallback) {
		try {
			const {value} = job.data;
			await authService.createAuthUser(value);
			// Add method to send data to database
			void job.progress(100);
			done(null, job.data);
		} catch (error) {
			log.error(error);
			done(error as Error);
		}
	}
}

export const authWorker: AuthWorker = new AuthWorker();
