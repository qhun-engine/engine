import * as express from "express";
import * as fs from "fs";
import * as path from "path";

const app = express();
app.get("/", (request, response) => {

    const html = fs.readFileSync(__dirname + "/public/index.html");
    const engine = `<script type="text/javascript" src="qhun-engine.js"></script>`;
    response.send(html + engine);
});

app.get("/qhun-engine.js", (request, response) => {

    response.sendFile(path.resolve(path.join(__dirname, "../../dist/bundle.js")));
});

app.listen(3000, () => {
    console.log("Up and running...");
});
