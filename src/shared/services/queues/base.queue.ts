import Queue, {type Job} from 'bull';
import type Logger from 'bunyan';
import {createBullBoard, BullAdapter, ExpressAdapter} from '@bull-board/express';
import {config} from '@root/config';
import {type AuthJobInterface} from '@auth/interfaces/auth.interface';

type BaseJobQueue =
  | AuthJobInterface;

let bullAdapter: BullAdapter[] = [];

export let serverAdapter: ExpressAdapter;

export abstract class BaseQueue {
	queue: Queue.Queue;
	log: Logger;

	constructor(queueName: string) {
		// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
		this.queue = new Queue(queueName, `${config.REDIS_HOST}`);
		bullAdapter.push(new BullAdapter(this.queue));
		bullAdapter = [...new Set(bullAdapter)];
		serverAdapter = new ExpressAdapter();
		serverAdapter.setBasePath('/queues');

		createBullBoard({
			queues: bullAdapter,
			serverAdapter,
		});

		this.log = config.createLogger(`${queueName}Queue`);

		this.queue.on('completed', (job: Job) => {
			void job.remove();
		});

		this.queue.on('global:completed', (jobId: string) => {
			this.log.info(`Job ${jobId} completed`);
		});

		this.queue.on('global:stalled', (jobId: string) => {
			this.log.info(`Job ${jobId} is stalled`);
		});
	}

	protected addJob(name: string, data: BaseJobQueue): void {
		void this.queue.add(name, data, {attempts: 3, backoff: {type: 'fixed', delay: 5000}});
	}

	protected processJob(name: string, concurrency: number, callback: Queue.ProcessCallbackFunction<void>): void {
		void this.queue.process(name, concurrency, callback);
	}
}
