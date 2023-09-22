const multer = require("multer");

const handlers = require("../handlers/handlers");
const config = require("../config/config");

const uploads = multer({ storage: config.storage });

module.exports = (app) => {
  //compare files
  app.post("/compare", uploads.array("files"), handlers.postCompareHandler);
  //join files
  app.post("/join", uploads.array("files"), handlers.postJoinFiles);
  //create print sample
  app.post("/list", uploads.array("files"), handlers.postListFile);
  //download to client
  app.get("/uploads", handlers.postDownloadHandler);
};
