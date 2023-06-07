const extract = require("extract-zip");
const path = require("path");
const fs = require("fs");

const result = [];
let zipName = "";

const join = async (filename) => {
  console.log("запуск объединения");
  console.log(`Имя архива: ${filename[0]}`);
  zipName = filename[0];
  await extract(__dirname + "/uploads/" + filename[0], {
    dir: path.join(__dirname, "/uploads/"),
  });

  await fs.unlink(__dirname + "/uploads/" + zipName, (e) => {
    if (e) {
      console.log(`Имя архива: ${zipName}`);
      console.log(e);
    } else {
      console.log("Файл " + zipName + " был удален из временной директории");
    }
  });

  await fs.readdir(path.join(__dirname, "/uploads/"), function (err, items) {
    console.log(items);

    for (var i = 0; i < items.length; i++) {
      console.log(items[i]);
    }
  });
};

module.exports = join;
