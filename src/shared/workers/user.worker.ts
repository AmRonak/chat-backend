/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {config} from '@root/config';
import {userService} from '@service/db/user.service.db';
import {type DoneCallback, type Job} from 'bull';
import type Logger from 'bunyan';

const log: Logger = config.createLogger('userWorker');

class UserWorker {
	async addUserToDb(job: Job, done: DoneCallback) {
		try {
			const {value} = job.data;
			await userService.addUserData(value);
			// Add method to send data to database
			void job.progress(100);
			done(null, job.data);
		} catch (error) {
			log.error(error);
			done(error as Error);
		}
	}
}

export const userWorker: UserWorker = new UserWorker();
