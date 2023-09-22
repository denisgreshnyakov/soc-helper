const XLSX = require("xlsx");
const ExcelJS = require("exceljs");
const extract = require("extract-zip");
const path = require("path");
const fs = require("fs");

const result = [];
let zipName = "";

const joining = async (filename) => {
  try {
    result.splice(0, result.length);
    zipName = filename[0];

    console.log(`Проверка расширения файла ${zipName}`);
    console.log();
    if (zipName.match(/[^.]+$/)[0] !== "zip") {
      deleteFiles(zipName);
      const e = new Error(`Неверное расширение файла`);
      throw e;
    }

    console.log(`Старт объединения архива: ${zipName}`);

    console.log("Извлечение...");
    await extract(path.join(__dirname, "../uploads/", zipName), {
      dir: path.join(path.join(__dirname, "../uploads/")),
    });
    console.log(`${zipName} был успешно извлечен.`);

    fs.readdir(path.join(__dirname, "../uploads/"), joinFiles);
    return 0;
  } catch (e) {
    console.log(e);
    return -1;
  }
};

const joinFiles = (err, items) => {
  console.log(`Запуск объединения...`);

  for (let i = 0; i < items.length; i++) {
    console.log("Чтение " + i + " файла: " + items[i]);

    if (items[i] !== zipName) {
      const workbook = XLSX.readFile(
        path.join(__dirname, "../uploads/", items[i])
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
    }
    deleteFiles(items[i]);
  }

  createResult();
};

const deleteFiles = (item) => {
  fs.unlink(path.join(__dirname, "../uploads/", item), (e) => {
    if (e) {
      console.log(e);
    } else {
      console.log("Файл " + item + " был удален из временной директории");
    }
  });
};

const createResult = async () => {
  console.log("Формирование результата объединения...");
  const workSheet = XLSX.utils.json_to_sheet(result);

  workSheet["!cols"] = [
    { wch: 50 },
    { wch: 20 },
    { wch: 120 },
    { wch: 16 },
    { wch: 35 },
    { wch: 35 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
  ];

  const workBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workBook, workSheet, "Объединенный результат");
  XLSX.writeFile(workBook, path.join(__dirname, "../uploads/result.xlsx"));

  const test = new ExcelJS.Workbook();
  await test.xlsx.readFile(path.join(__dirname, "../uploads/result.xlsx"));

  // console.log(test._worksheets);
  const worksheet = test.getWorksheet("Объединенный результат");

  // const header = worksheet.getRow(1);

  worksheet.mergeCells("W1:Z1");

  // table.getCell("A1").border = {
  //   top: { style: "thin" },
  //   left: { style: "thin" },
  //   bottom: { style: "thin" },
  //   right: { style: "thin" },
  // };
  // worksheet.getColumn("B").font = {
  //   name: "Comic Sans MS",
  //   family: 4,
  //   size: 16,
  //   underline: true,
  //   bold: true,
  // };
  // console.log(header);
  await test.xlsx.writeFile(path.join(__dirname, "../uploads/test.xlsx"));
};

module.exports = joining;
