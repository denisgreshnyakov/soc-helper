const XLSX = require("xlsx");
const ExcelJS = require("exceljs");
const extract = require("extract-zip");
const path = require("path");
const fs = require("fs");

const result = [];
let zipName = "";

const listing = async (filename) => {
  console.log("Начало формирования шаблона.");

  console.log(filename[0]);

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(
    path.join(__dirname, `../uploads/${filename[0]}`)
  );

  await workbook.xlsx.writeFile(path.join(__dirname, "../uploads/result.xlsx"));
  console.log("Формирование шаблона завершено.");
};

module.exports = listing;
