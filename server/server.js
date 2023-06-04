const http = require("http");
const fs = require("fs");
const path = require("path");

const express = require("express");
const multer = require("multer");
const cors = require("cors");

const compare = require("./comparing");

const app = express();
const router = express.Router();

const filename = [];

let staticSiteOptions = {
  portnum: 80, // слушать порт 80
  maxAge: 1000 * 60 * 15, // хранить страницы в кэше пятнадцать минут
};

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, __dirname + "/uploads");
  },
  // Sets file(s) to be saved in uploads folder in same directory
  filename: function (req, file, callback) {
    file.originalname = Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    );
    filename.push(file.originalname);
    callback(null, file.originalname);
  },
  // Sets saved filename(s) to be original filename(s)
});

const uploads = multer({ storage: storage });

const postCompareHandler = (req, res) => {
  console.log("Файлы успешно загружены на сервер");
  console.log(filename);
  return processFiles(res);
};

const processFiles = (res) => {
  try {
    const result = compare(filename);

    if (result.hasOwnProperty("error")) {
      filename.splice(0, filename.length);
      const e = result.error;
      throw e;
    }

    filename.splice(0, filename.length);
    return res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({
      message: e.message,
      error: true,
    });
  }
};

const postDownloadHandler = (req, res) => {
  if (fs.existsSync(__dirname + "/uploads/result.xlsx")) {
    console.log("Отправка файла с результатом...");
    return res.download(
      __dirname + "/uploads/result.xlsx",
      "result.xlsx",
      (errDownload) => {
        fs.unlink(__dirname + "/uploads/" + "result.xlsx", (errDelete) => {
          if (errDelete) {
            console.log(errDelete.message);
          } else {
            console.log(
              "Файл с результатом был удален из временной директории сервера"
            );
          }
        });
        if (errDownload) {
          console.log(errDownload.message);
        } else {
          console.log("Файл c результатом был успешно отправлен на клиент");
        }
      }
    );
  }
  return res.status(500).json({ message: "Ошибка загрузки файла на клиент" });
};

app
  .use(cors())
  .use(express.static(path.join(__dirname, "../client/"), staticSiteOptions));

//upload files
app.post("/", uploads.array("files"), postCompareHandler);
//download to client
app.get("/uploads", postDownloadHandler);

app.listen(80, "192.168.0.103", () => {
  console.log("SOC-Helper начал работу");
});

// app.listen(80, "192.168.1.27", () => {
//   console.log("Server running on port 5000");
// });
