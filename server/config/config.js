const multer = require("multer");
const path = require("path");

const port = 80;
const ip = "192.168.1.101";
const version = "1.2.0";

const filename = [];

let staticSiteOptions = {
  portnum: port, // слушать порт 80
  maxAge: 1000 * 60 * 15, // хранить страницы в кэше пятнадцать минут
};

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, "../uploads"));
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

module.exports = {
  port,
  ip,
  version,
  staticSiteOptions,
  filename,
  storage,
};
