import { Inject } from "../engine/di/Inject";
import { Router } from "./router/Router";
import * as express from "express";
import * as http from "http";

export class QhunEngineServer {

    @Inject()
    private router!: Router;
    private expressApp: express.Application;

    constructor() {

        // build express app
        this.expressApp = express();
        this.expressApp.use(this.router.getConfiguredExpressRouter());
    }

    public listen(port: number = 3000): http.Server {

        return http.createServer(this.expressApp).listen(port);
    }
}
