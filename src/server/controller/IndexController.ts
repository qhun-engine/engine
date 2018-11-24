import { Controller } from "./Controller";
import { RequestMapping } from "../router/RequestMapping";
import { FileResponse } from "./response/FileResponse";
import * as fs from "fs";

@Controller("/")
export class IndexController {

    @RequestMapping()
    public async index(): Promise<string> {

        return new Promise<string>((resolve, reject) => {
            fs.readFile(__dirname + "/../public/index.html", (error, data) => {

                if (error) {
                    reject(error);
                } else {

                    const html = data.toString();
                    resolve(html.replace("</head>", `<script type="text/javascript" src="qhun-engine.js"></script></head>`));
                }
            });
        });
    }

    @RequestMapping({ path: "qhun-engine.js" })
    public getEngineScript(): FileResponse {

        return new FileResponse(__dirname + "/../../../dist/bundle.js");
    }
}
