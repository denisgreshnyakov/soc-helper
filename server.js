const http = require("http");
const fs = require("fs");

const requestListener = function (request, response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  console.log(request.url);
  if (request.url === "/") {
    let data = "";
    request.on("data", (chunk) => {
      data += chunk;
    });
    request.on("end", () => {
      console.log(data);
      response.end("Данные успешно получены");
    });
  } else {
    console.log("this place is working now");
    fs.readFile("index.html", (error, data) => response.end(data));
  }
};

http
  .createServer(requestListener)
  .listen(3000, () =>
    console.log("Сервер запущен по адресу http://localhost:3000")
  );
