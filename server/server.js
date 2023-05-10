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

app.post("/uploads", uploads.array("files"), (req, res) => {
  // console.log(req.body);
  // console.log(req.files);

  res.json({ status: "files received" });
});

app.post("/", (req, res) => {
  compare(filename);
  filename.length = 0;
  res.json({ status: "files have compared" });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
