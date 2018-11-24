import { Injectable } from "../../engine/di/Injectable";
import { Router as ExpressRouter } from "express";
import { ControllerMetadataStructure } from "../controller/Controller";
import { RequestMappingStructure, HttpMethod } from "./RequestMapping";
import qhunServerControllers from "../controller";
import "reflect-metadata";
import { Injector } from "../../engine/di/Injector";
import * as express from "express";
import { FileResponse } from "../controller/response/FileResponse";
import { ReflectionMetadata } from "../../engine/constraint/ReflectionMetadata";

@Injectable()
export class Router {

    private expressRouter: ExpressRouter;

    constructor() {

        // build router
        this.expressRouter = ExpressRouter({
            caseSensitive: false
        });

        // configure routes
        this.configureRoutes();
    }

    public getConfiguredExpressRouter(): ExpressRouter {

        return this.expressRouter;
    }

    /**
     * bind all existing roues from every `@Controller` context to the express router
     */
    private configureRoutes(): void {

        // get the injector for controller instantiation
        const injector = Injector.getInstance();

        qhunServerControllers.forEach(controller => {

            // get prefix for controller
            const controllerMetadata: ControllerMetadataStructure = Reflect.getMetadata(ReflectionMetadata.Controller, controller);

            // get controller instance
            const controllerInstance = injector.instantiateClass(controller);

            // get request mapping metadata
            const requestMappingMetadata: RequestMappingStructure = Reflect.getMetadata(ReflectionMetadata.RequestMapping, controllerInstance);

            // iterate over every request mapping and add it to the router
            Object.keys(requestMappingMetadata).forEach((path: keyof RequestMappingStructure) => {

                const settings = requestMappingMetadata[path];
                this.addRequestMapping(
                    controllerMetadata.prefix,
                    path as string,
                    settings.method,
                    settings.handler,
                    `${controllerMetadata.name}@${settings.methodName}`
                );
            });

        });
    }

    /**
     * add the given request mapping to the router
     * @param prefix the controller prefix
     * @param path the request mapping path
     * @param method the http method to listen on
     * @param handler the handler function
     * @param name a visible name for debug purpose for this endpoint
     */
    private addRequestMapping(prefix: string, path: string, method: HttpMethod, handler: ((...args: any[]) => any), name: string): void {

        // add this request mapping
        this.expressRouter[method](prefix + path, (request, response) => {
            this.handleRouterResponse(request, response, handler);
        });

        // log this info
        console.log(`[${method.toUpperCase()}] ${prefix + path} => ${name}`);
    }

    /**
     * handle the router response
     * @param request the express request
     * @param response the express response
     * @param handler the handler function
     */
    private handleRouterResponse(request: express.Request, response: express.Response, handler: ((...args: any[]) => any)): void {

        this.respondWithHandlerResult(handler(request), response);
    }

    private respondWithHandlerResult(result: any, response: express.Response): void {

        // what does handler returned?
        if (result && result instanceof FileResponse) {

            response.sendFile(result.getPath());
        } else if (result && result instanceof Promise) {

            result
                .then(res => this.respondWithHandlerResult(res, response))
                .catch(err => this.respondWithHandlerResult(err, response));
        } else {

            response.send(result);
        }
    }

}
