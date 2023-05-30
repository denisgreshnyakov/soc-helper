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

app
  .use(cors())
  .use(express.static(path.join(__dirname, "../client/"), staticSiteOptions));

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

//upload files
app.post("/uploads", uploads.array("files"), (req, res) => {
  try {
    console.log("Файлы успешно загружены на сервер");
    console.log(filename);
    // res.json({ message: "Файлы успешно загружены на сервер." });
  } catch (e) {
    console.log("Ошибка при загрузке файла на сервер: " + e);
    res.status(500).json({ message: "Ошибка при загрузке файла на сервер " });
  }
  return processFiles(res);
});

const processFiles = (res) => {
  try {
    const result = compare(filename);
    filename.splice(0, filename.length);
    return res.json(result);
  } catch (e) {
    console.log("Ошибка при сравнении файлов: " + e);
    return res.status(500).json({ message: "Ошибка при сравнении файлов " });
  }
};

//download
app.get("/uploads", (req, res) => {
  try {
    if (fs.existsSync(__dirname + "/uploads/result.xlsx")) {
      console.log("Файл с результатом найден! Отправка");
      return res.download(
        __dirname + "/uploads/result.xlsx",
        "result.xlsx",
        (err) => {
          fs.unlink(__dirname + "/uploads/" + "result.xlsx", (err) => {
            if (err) throw err;
            console.log(
              "Файл с результатом был удален из временной директории"
            );
          });
          if (err) {
            console.log(
              "Ошибка при отправке файла с результатом на клиент: " + err
            );
          }
        }
      );
    }
    return res.status(400).json({ message: "Ошибка загрузки файла на клиент" });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Internal Server Error (Ошибка загрузки файла на клиент)",
    });
  }
});

app.listen(80, "192.168.1.27", () => {
  console.log("SOC-Helper начал работу");
});

// app.listen(80, "192.168.1.27", () => {
//   console.log("Server running on port 5000");
// });
