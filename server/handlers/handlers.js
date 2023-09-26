const fs = require("fs");
const path = require("path");
const config = require("../config/config");

const compare = require("./comparing");
const joining = require("./joining");
const listing = require("./listing");

const postCompareHandler = (req, res) => {
  console.log("Файлы успешно загружены на сервер");
  const result = compare(config.filename);

  if (result.hasOwnProperty("error")) {
    config.filename.splice(0, config.filename.length);
    console.log(result.error.message);
    return res.status(500).json({
      message: result.error.message,
    });
  }

  config.filename.splice(0, config.filename.length);
  return res.status(200).json(result);
};

const postDownloadHandler = (req, res) => {
  if (fs.existsSync(path.join(__dirname, "../uploads/result.xlsx"))) {
    console.log("Отправка файла с результатом...");
    return res.download(
      path.join(__dirname, "../uploads/result.xlsx"),
      "result.xlsx",
      (errDownload) => {
        fs.unlink(
          path.join(__dirname, "../uploads/result.xlsx"),
          (errDelete) => {
            if (errDelete) {
              console.log(errDelete.message);
            } else {
              console.log(
                "Файл с результатом был удален из временной директории сервера"
              );
            }
          }
        );
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

const postJoinFiles = async (req, res) => {
  console.log("Файлы успешно загружены на сервер");
  const result = await joining(config.filename);
  config.filename.splice(0, config.filename.length);
  if (result === 0) {
    return res
      .status(200)
      .json({ join: "Файлы успешно объединены, выдача ответа..." });
  } else {
    return res.status(500).json({ join: "Неверное расширение файла!" });
  }
};

const postListFile = async (req, res) => {
  console.log("Файл успешно загружен на сервер");
  const result = await listing(config.filename);
  config.filename.splice(0, config.filename.length);
  return res
    .status(200)
    .json({
      join: "Шаблон для печати успешно создан, выдача ответа...",
      district: result,
    });
};

module.exports = {
  postCompareHandler,
  postJoinFiles,
  postDownloadHandler,
  postListFile,
};
