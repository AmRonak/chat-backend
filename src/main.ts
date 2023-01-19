import express, {type Express} from 'express';
import {config} from '@root/config';
import databaseConnection from '@root/setupDatabase';
import {MainServer} from '@root/setupServer';

class Application {
	public start(): void {
		this.loadConfig();
		databaseConnection();
		const app: Express = express();
		const server: MainServer = new MainServer(app);
		server.start();
	}

	private loadConfig(): void {
		config.validationConfig();
	}
}

const application: Application = new Application();

application.start();
