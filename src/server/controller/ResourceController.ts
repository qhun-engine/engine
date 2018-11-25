import * as express from "express";
import { Controller } from "./Controller";
import { RequestMapping } from "../router/RequestMapping";
import { FileResponse } from "./response/FileResponse";

@Controller("/assets/")
export class ResourceController {

    @RequestMapping({ path: "*" })
    public getResource(request: express.Request): FileResponse {

        const file = request.path;
        const path = __dirname + "/../public" + file;
        return new FileResponse(path);
    }
}
