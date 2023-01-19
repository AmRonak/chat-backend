import express, { Express } from "express";
import { config } from "./config";
import databaseConnection from "./setupDatabase";
import { MainServer } from "./setupServer";

class Application {
  public start(): void {
    this.loadConfig();
    databaseConnection();
    const app: Express = express();
    const server: MainServer = new MainServer(app);
    server.start();
  }

  private loadConfig(): void {
    config.validationConfig()
  }
}

const application: Application = new Application();

application.start();