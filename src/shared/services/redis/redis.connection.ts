import {config} from '@root/config';
import type Logger from 'bunyan';
import {BaseCache} from '@service/redis/base.cache';

const log: Logger = config.createLogger('redisConnection');

class RedisConnection extends BaseCache {
	constructor() {
		super('redisConnection');
	}

	async connect(): Promise<void> {
		try {
			await this.client.connect();
			const res = await this.client.ping();
		} catch (error) {
			log.error(error);
		}
	}
}

const redisConnection = new RedisConnection();

export default redisConnection;
