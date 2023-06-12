const XLSX = require("xlsx");
const extract = require("extract-zip");
const path = require("path");
const fs = require("fs");

const result = [];
let zipName = "";

const join = async (filename) => {
  try {
    result.splice(0, result.length);

    console.log(`Старт объединения архива: ${filename[0]}`);
    zipName = filename[0];

    console.log("Извлечение...");
    await extract(__dirname + "/uploads/" + filename[0], {
      dir: path.join(__dirname, "/uploads/"),
    });
    console.log(`${filename[0]} был успешно извлечен.`);

    fs.readdir(path.join(__dirname, "/uploads/"), function (err, items) {
      console.log(`Запуск объединения следующих файлов: ${items}`);

      for (let i = 0; i < items.length; i++) {
        console.log("Чтение " + i + " файла: " + items[i]);

        if (items[i] !== zipName) {
          const workbook = XLSX.readFile(
            path.join(__dirname, "/uploads/", items[i])
          );

          const workssheet = workbook.Sheets[workbook.SheetNames[0]];

          const workssheetJSON = XLSX.utils.sheet_to_json(workssheet);

          workssheetJSON.forEach((obj, j) => {
            const newObject = {};
            if (j !== 0) {
              for (item in obj) {
                newObject[workssheetJSON[0][item]] = obj[item];
              }
            }

            if (Object.keys(newObject).length !== 0) {
              result.push(newObject);
            }
          });
          fs.unlink(path.join(__dirname, "/uploads/", items[i]), (e) => {
            if (e) {
              console.log(e);
            } else {
              console.log(
                "Файл " + items[i] + " был удален из временной директории"
              );
            }
          });
        }
      }

      console.log("Формирование результата объединения...");
      const workSheet = XLSX.utils.json_to_sheet(result);
      const workBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        workBook,
        workSheet,
        "Объединенный результат"
      );
      XLSX.writeFile(workBook, path.join(__dirname, "/uploads/result.xlsx"));
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports = join;
