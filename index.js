const fsPromises = require("fs").promises;
const http = require("node:http");
const logEvent = require("./logEvent");
const EventEmitter = require("events");
const PORT = process.env.port || 3501;

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

myEmitter.on("log", (message, filename) => {
  console.log(message);
  logEvent(message, filename);
});

const serveFile = async (filepath, contentType, res) => {
  const name = "yeyey";

  try {
    const rawData = await fsPromises.readFile(
      filepath,
      !contentType.includes("image") ? "utf8" : "",
    );

    let data =
      contentType === "application/json" ? JSON.parse(rawData) : rawData;

    if (contentType === "text/html") {
      data = data.replaceAll("{{name}}", name);
    }

    res.writeHead(200, { "Content-Type": contentType });

    res.end(contentType === "application/json" ? JSON.stringify(data) : data);
  } catch (err) {
    console.error(err);

    res.statusCode = 500;
    res.end();
  }
};

const server = http.createServer((req, res) => {
  myEmitter.emit("log", `${req.url} ${req.method}`, "reqLog.txt");
  if (req.method === "GET") {
    serveFile("./views/index.html", "text/html", res);
    return;
  }

  if (req.method === "POST") {
    serveFile("./data.json", "application/json", res);
    return;
  }

  res.statusCode = 204;
  res.end(JSON.stringify({ message: "No Content" }));
});

server.listen(PORT, () => {
  console.log("Running on the port " + PORT);
});
