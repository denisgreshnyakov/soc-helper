const XLSX = require("xlsx");
const ExcelJS = require("exceljs");
const extract = require("extract-zip");
const path = require("path");
const fs = require("fs");

// const data = [];
const cleanColumns = [];
const result = [];
let zipName = "";

let headers;
let countSpr = 0;

const listing = async (filename) => {
  console.log("Начало формирования шаблона.");
  console.log("Смена формата на XLSX.");
  const workbook = XLSX.readFile(
    path.join(__dirname, `../uploads/${filename[0]}`)
  );

  XLSX.writeFile(
    workbook,
    path.join(__dirname, "../uploads/changeFormat.xlsx")
  );
  console.log(
    "Смена формата завершена, сформирован промежуточный файл changeFormat.xlsx"
  );

  // for (let i = 0; i < data[0].length; i++) {
  //   for (key in data[0][i]) {
  //   }
  // }

  // console.log(data[0][1].__EMPTY_6);
  // console.log(Object.keys(data[0][1]).length);

  // console.log(filename[0]);

  const book = new ExcelJS.Workbook();
  await book.xlsx.readFile(
    path.join(__dirname, `../uploads/changeFormat.xlsx`)
  );

  const worksheet = book.getWorksheet("Sheet0");

  worksheet.spliceColumns(18, 10);
  worksheet.spliceColumns(15, 2);
  worksheet.spliceColumns(6, 1);

  const sheetSpr = book.addWorksheet("Справки");
  const sheetTemporary = book.addWorksheet("Временно");
  // sheetSpr.addRow(["Справки из регистра карточек обращений"]);

  worksheet.eachRow(function (row, rowNumber) {
    // console.log("Row " + rowNumber + " = " + JSON.stringify(row.values));

    if (rowNumber === 2) {
      headers = row.values;
    }

    row.values.forEach((element, i) => {
      // console.log(`${i}: ${element}`);

      if (
        i === 13 &&
        typeof element === "string" &&
        element.includes("правк")
      ) {
        // console.log(row.values);
        countSpr++;
        sheetTemporary.addRow(row.values);
      }
    });

    //Do whatever you want to do with this row like inserting in db, etc
  });

  sortByColumn(7, sheetTemporary, sheetSpr);

  sheetSpr.spliceRows(1, 0, ["Справки из регистра карточек обращений"]);
  sheetSpr.spliceRows(2, 0, headers);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();

  sheetSpr.spliceColumns(1, 0, []);
  sheetSpr.getCell("A2").value = "№";

  for (let i = 1; i - 1 < countSpr; i++) {
    sheetSpr.getCell(`A${i + 2}`).value = i;
  }

  sheetSpr.addRow([]);
  sheetSpr.addRow([]);
  sheetSpr.addRow([`Выполнил: Грешняков Д.В.`]);
  sheetSpr.addRow([`Всего карточек: ${countSpr}`]);
  sheetSpr.addRow([`Дата создания списка: ${day}.${month + 1}.${year}`]);

  sheetSpr.mergeCells("A1:O1");
  sheetSpr.getRow(2).eachCell(function (cell, cellNumber) {
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    cell.font = {
      name: "Times New Roman",
      size: 11,
      bold: true,
    };
    cell.alignment = {
      wrapText: true,
      vertical: "middle",
      horizontal: "center",
    };
  });

  sheetSpr.getRows(3, countSpr).forEach((row, numRow) => {
    row.eachCell(function (cell, cellNumber) {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      cell.font = {
        name: "Arial",
        size: 10,
        bold: false,
      };
      cell.alignment = {
        wrapText: true,
        vertical: "middle",
        horizontal: "left",
      };
    });
  });

  sheetSpr.getColumn(1).width = 3;
  sheetSpr.getColumn(2).width = 7.86;
  sheetSpr.getColumn(3).width = 7.86;
  sheetSpr.getColumn(4).width = 17.43;
  sheetSpr.getColumn(5).width = 13.57;
  sheetSpr.getColumn(6).width = 13.57;
  sheetSpr.getColumn(7).width = 13.57;
  sheetSpr.getColumn(8).width = 20.71;
  sheetSpr.getColumn(9).width = 9.5;
  sheetSpr.getColumn(10).width = 13.57;
  sheetSpr.getColumn(11).width = 27.86;
  sheetSpr.getColumn(12).width = 20.71;
  sheetSpr.getColumn(13).width = 13.57;
  sheetSpr.getColumn(14).width = 27.86;
  sheetSpr.getColumn(15).width = 13.57;

  sheetSpr.getRow(2).height = 42.75;

  sheetSpr.getRows(3, countSpr).forEach((row, numRow) => {
    row.height = 63.75;
  });

  book.removeWorksheet("Временно");

  // sheetSpr.pageSetup.printTitlesColumn = "A:O";
  sheetSpr.pageSetup.orientation = "landscape";
  sheetSpr.pageSetup.paperSize = 9;
  sheetSpr.pageSetup.printArea = `A1:O${countSpr + 7}`;

  await book.xlsx.writeFile(path.join(__dirname, `../uploads/result.xlsx`));

  // await workbook.xlsx.writeFile(path.join(__dirname, "../uploads/result.xlsx"));
  console.log("Формирование шаблона завершено.");
};

const sortByColumn = (columnNum, worksheet, newWorkSheet) => {
  if (worksheet) {
    columnNum--;
    const sortFunction = (a, b) => {
      if (a[columnNum] === b[columnNum]) {
        return 0;
      } else {
        return a[columnNum] < b[columnNum] ? -1 : 1;
      }
    };
    let rows = [];
    for (let i = 1; i <= worksheet.actualRowCount; i++) {
      let row = [];
      for (let j = 1; j <= worksheet.columnCount; j++) {
        row.push(worksheet.getRow(i).getCell(j).value);
      }
      rows.push(row);
    }
    rows.sort(sortFunction);

    // Remove all rows from worksheet then add all back in sorted order
    // worksheet.spliceRows(5, 20);
    // Note worksheet.addRows() may add them to the end of empty rows so loop through and add to beginnning
    // console.log(`rows.length: ${rows.length}`);
    // worksheet.eachRow(function (row, rowNumber) {
    //   console.log("Row " + rowNumber + " = " + JSON.stringify(row.values));
    // });
    for (let i = 0; i < rows.length; i++) {
      // worksheet.spliceRows(0, 0, rows[i]);
      newWorkSheet.addRow(rows[i]);
      // console.log(`Сколько же тут строк? : ${i}`);
    }
    // worksheet.eachRow(function (row, rowNumber) {
    //   console.log("Row " + rowNumber + " = " + JSON.stringify(row.values));
    // });
    // console.log(`чистка`);
    // worksheet.spliceRows(1, 0);
    newWorkSheet.eachRow(function (row, rowNumber) {
      console.log("Row " + rowNumber + " = " + JSON.stringify(row.values));
    });
  }
};

module.exports = listing;
