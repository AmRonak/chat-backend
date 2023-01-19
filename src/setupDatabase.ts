import type Logger from 'bunyan';
import mongoose from 'mongoose';
import {config} from '@root/config';

const log: Logger = config.createLogger('setupDatabase');

export default () => {
	const connect = () => {
		mongoose.connect(`${config.DATABASE_URL!}`)
			.then(() => {
				log.info('Successfully connected to database');
			})
			.catch(error => {
				log.error('Error connecting database: ', error);
				return process.exit(1);
			});
	};

	connect();

	mongoose.connection.on('disconnected', connect);
};
