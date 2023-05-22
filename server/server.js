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
  .use(express.static(path.join(__dirname, "../client"), staticSiteOptions));

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
    console.log("files have been uploaded to the server");
    console.log(filename);
    res.json({ message: "Файлы успешно загружены на сервер." });
  } catch (e) {
    console.log("upload files error: " + e);
    res.status(500).json({ message: "upload files error " });
  }
});

//compare files
app.post("/", (req, res) => {
  try {
    const result = compare(filename);
    filename.splice(0, filename.length);
    res.json(result);
  } catch (e) {
    console.log("comparing files error: " + e);
    res.status(500).json({ message: "comparing files error " });
  }
});

//download
app.get("/uploads", (req, res) => {
  try {
    if (fs.existsSync(__dirname + "/uploads/result.xlsx")) {
      console.log("file exist! Sending");
      return res.download(
        __dirname + "/uploads/result.xlsx",
        "result.xlsx",
        (err) => {
          fs.unlink(__dirname + "/uploads/" + "result.xlsx", (err) => {
            if (err) throw err;
            console.log("file result.xlsx has been deleted");
          });
          if (err) {
            console.log("error sending data to client, type: " + err);
          }
        }
      );
    }
    return res.status(400).json({ message: "Download error" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error (Download error)" });
  }
});

app.listen(80, "192.168.1.27", () => {
  console.log("Server running on port 5000");
});
