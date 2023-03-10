import {
	type Application,
	json,
	urlencoded,
	type Response,
	type Request,
	type NextFunction,
} from 'express';
import http from 'http';
import cors from 'cors';
import hpp from 'hpp';
import cookieSession from 'cookie-session';
import helmet from 'helmet';
import HTTP_STATUS from 'http-status-codes';
import compression from 'compression';
import 'express-async-errors';
import {Server} from 'socket.io';
import {createClient} from 'redis';
import {createAdapter} from '@socket.io/redis-adapter';
import type Logger from 'bunyan';
import {config} from '@root/config';
import applicationRoutes from '@root/routes';
import {CustomError, type ErrorInterface} from '@global/helpers/error-handler';
const log: Logger = config.createLogger('server');

export class MainServer {
	constructor(private readonly app: Application) {
		this.app = app;
	}

	public start(): void {
		this.securityMiddleware(this.app);
		this.standardMiddleware(this.app);
		this.routesMiddleware(this.app);
		this.globalErrorHandler(this.app);
		void this.startServer(this.app);
	}

	private securityMiddleware(app: Application): void {
		app.use(
			cookieSession({
				name: 'server-session',
				keys: [config.SECRET_KEY_ONE!, config.SECRET_KEY_TWO!],
				maxAge: 24 * 7 * 3600000,
				secure: config.NODE_ENV !== 'development',
			}),
		);
		app.use(hpp());
		app.use(helmet());
		app.use(
			cors({
				origin: config.CLIENT_URL,
				credentials: true,
				optionsSuccessStatus: 200,
				methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
			}),
		);
	}

	private standardMiddleware(app: Application): void {
		app.use(compression());
		app.use(json({limit: '50mb'}));
		app.use(urlencoded({extended: true, limit: '50mb'}));
	}

	private routesMiddleware(app: Application): void {
		applicationRoutes(app);
	}

	private globalErrorHandler(app: Application): void {
		app.all('*', async (req: Request, res: Response) => {
			res.status(HTTP_STATUS.NOT_FOUND).json({message: `${req.originalUrl} not found`});
		});

		app.use((error: ErrorInterface, _req: Request, res: Response, next: NextFunction) => {
			log.error(error);
			if (error instanceof CustomError) {
				return res.status(error.statusCode).json(error.serializeErrors());
			}
		});
	}

	private async startServer(app: Application): Promise<void> {
		try {
			const httpServer: http.Server = new http.Server(app);
			const socketIo: Server = await this.createSocketIo(httpServer);
			this.startHttpServer(httpServer);
			this.socketIoConnections(socketIo);
		} catch (error) {
			log.error({error});
		}
	}

	private async createSocketIo(httpServer: http.Server): Promise<Server> {
		const io: Server = new Server(httpServer, {
			cors: {
				origin: config.CLIENT_URL,
				methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
			},
		});
		const publishClient = createClient({url: config.REDIS_HOST});
		const subscriptionClient = publishClient.duplicate();
		await Promise.all([publishClient.connect(), subscriptionClient.connect()]);
		io.adapter(createAdapter(publishClient, subscriptionClient));
		return io;
	}

	private startHttpServer(httpServer: http.Server): void {
		log.info(`Server has started with process ${process.pid}`);
		httpServer.listen(config.SERVER_PORT, () => {
			log.info(`Server is running on ${config.SERVER_PORT!}`);
		});
	}

	private socketIoConnections(io: Server): void {}
}
