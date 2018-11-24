import { QhunEngineServer } from "./QhunEngineServer";

const q = new QhunEngineServer();
q.listen();

/*
const app = express();
app.get("/", (request, response) => {

    const html = fs.readFileSync(__dirname + "/public/index.html").toString();
    const engine = `<script type="text/javascript" src="qhun-engine.js"></script>`;
    response.send(html.replace("</head>", engine + "</head>"));
});

app.get("/qhun-engine.js", (request, response) => {

    response.sendFile(path.resolve(path.join(__dirname, "../../dist/bundle.js")));
});

app.listen(3000, () => {
    console.log("Up and running...");
});
*/
