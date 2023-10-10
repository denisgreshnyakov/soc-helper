const XLSX = require("xlsx");
const ExcelJS = require("exceljs");
const { getJsDateFromExcel } = require("excel-date-to-js");
const path = require("path");
const fs = require("fs");

let district = "";

let headers;

let countAll = 0;
let countRef = 0;
let countBurial = 0;
let countASPK = 0;
let countNU = 0;
let countUK = 0;
let countTourism = 0;
let countAdaptation = 0;
let countCommon = 0;
let count37 = 0;
let countDec = 0;
let countEDK = 0;
let countVT = 0;
let countUnknown = 0;

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

  const book = new ExcelJS.Workbook();
  await book.xlsx.readFile(
    path.join(__dirname, `../uploads/changeFormat.xlsx`)
  );

  const worksheet = book.getWorksheet("Sheet0");

  worksheet.spliceColumns(19, 11);
  worksheet.spliceColumns(16, 2);
  worksheet.spliceColumns(6, 2);

  worksheet.eachRow(function (row, rowNumber) {
    row.values.forEach((element, i) => {
      if (i === 3 && typeof element === "number") {
        let date = getJsDateFromExcel(row.getCell(3).value);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        if (month < 10) {
          if (day < 10) {
            row.getCell(3).value = `0${day}.0${month}.${year}`;
          } else {
            row.getCell(3).value = `${day}.0${month}.${year}`;
          }
        } else {
          if (day < 10) {
            row.getCell(3).value = `0${day}.${month}.${year}`;
          } else {
            row.getCell(3).value = `${day}.${month}.${year}`;
          }
        }
      }
      if (i === 8 && typeof element === "number") {
        let date = getJsDateFromExcel(row.getCell(8).value);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        if (month < 10) {
          if (day < 10) {
            row.getCell(8).value = `0${day}.0${month}.${year}`;
          } else {
            row.getCell(8).value = `${day}.0${month}.${year}`;
          }
        } else {
          if (day < 10) {
            row.getCell(8).value = `0${day}.${month}.${year}`;
          } else {
            row.getCell(8).value = `${day}.${month}.${year}`;
          }
        }
      }
    });
  });

  //general sheets
  const sheetNewAll = book.addWorksheet("Все");
  const sheetCommon = book.addWorksheet("Общие");
  const sheetDec = book.addWorksheet("По заявлению");
  const sheet37 = book.addWorksheet("3-7");
  const sheetEDK = book.addWorksheet("ЕДК");
  const sheetRef = book.addWorksheet("Справки");
  const sheetVT = book.addWorksheet("ВТ");
  const sheetASPK = book.addWorksheet("АСПК");
  const sheetBurial = book.addWorksheet("Погребение");
  const sheetNU = book.addWorksheet("НУ");
  const sheetUK = book.addWorksheet("Мат. помощь");
  const sheetTourism = book.addWorksheet("Соц. туризм");
  const sheetAdaptation = book.addWorksheet("Соц. адаптация");
  const sheetUnknown = book.addWorksheet("Прочее");
  const sheetStatistics = book.addWorksheet("Статистика");

  //temporary sheets
  const sheetTempRef = book.addWorksheet("Справки временно");
  const sheetTempDec = book.addWorksheet("По заявлению временно");
  const sheetTempBurial = book.addWorksheet("Погребение временно");
  const sheetTempASPK = book.addWorksheet("АСПК временно");
  const sheetTempNU = book.addWorksheet("НУ временно");
  const sheetTempUK = book.addWorksheet("Мат. помощь временно");
  const sheetTempTourism = book.addWorksheet("Соц. туризм временно");
  const sheetTempAdaptation = book.addWorksheet("Соц. адаптация временно");
  const sheetTempCommon = book.addWorksheet("Общие временно");
  const sheetTempEDK = book.addWorksheet("ЕДК временно");
  const sheetTemp37 = book.addWorksheet("3-7 временно");
  const sheetTempVT = book.addWorksheet("ВТ временно");
  const sheetTempUnknown = book.addWorksheet("Прочее временно");

  worksheet.eachRow(function (row, rowNumber) {
    if (rowNumber === 2) {
      headers = row.values;
    }

    if (rowNumber !== 1 && rowNumber !== 2) {
      sheetNewAll.addRow(row.values);
      countAll++;
    }

    row.values.forEach((element, i) => {
      if (
        i === 13 &&
        typeof element === "string" &&
        element.includes("правк")
      ) {
        countRef++;
        sheetTempRef.addRow(row.values);
      } else if (
        i === 13 &&
        typeof element === "string" &&
        element.includes("по заявлению")
      ) {
        countDec++;
        sheetTempDec.addRow(row.values);
      } else if (
        i === 13 &&
        typeof element === "string" &&
        element.includes("погребение")
      ) {
        countBurial++;
        sheetTempBurial.addRow(row.values);
      } else if (
        i === 13 &&
        typeof element === "string" &&
        element.includes("АСПК")
      ) {
        countASPK++;
        sheetTempASPK.addRow(row.values);
      } else if (
        i === 13 &&
        typeof element === "string" &&
        element.includes("Народный университет")
      ) {
        countNU++;
        sheetTempNU.addRow(row.values);
      } else if (
        i === 13 &&
        typeof element === "string" &&
        element.includes("Мат. помощь чл.семей в/служ.,погиб")
      ) {
        countUK++;
        sheetTempUK.addRow(row.values);
      } else if (
        i === 13 &&
        typeof element === "string" &&
        element.includes("Социальный туризм")
      ) {
        countTourism++;
        sheetTempTourism.addRow(row.values);
      } else if (
        i === 13 &&
        typeof element === "string" &&
        (element.includes("ЕДВ") ||
          element.includes("(многодетные семьи)") ||
          element.includes("Ежегодная выплата донорам") ||
          element.includes("Ежем. выплата Заслуж. работникам РБ") ||
          element.includes(
            "Вознаграждн. за добровол.сдачу оружия и боеприпас."
          ) ||
          element.includes("Единовременное пособие члену семьи") ||
          element.includes("Ежемесячное пособие на ребенка") ||
          element.includes(
            "Ежемесячное пособие отдельным категориям многодет.семей"
          ) ||
          element.includes(
            "Ежемесячное пособие по уходу за ребенком-инвалидом"
          ) ||
          element.includes(
            "Ежемесячное пособие семье студентов-аспирантов, имеющих детей"
          ) ||
          element.includes("Ежемесячное социальное пособие") ||
          element.includes("ЕКВ специалистам проживающим и работающим в с/м") ||
          element.includes("кап.ремонт") ||
          element.includes(
            "Материальная помощь в случае потери надворных построек от пожара"
          ) ||
          element.includes(
            "Материальная помощь в трудной жизненной ситуации"
          ) ||
          element.includes("Материальная помощь, пострадавшим от пожара") ||
          element.includes(
            "Направление на обесп.протезно-ортопедическими изд."
          ) ||
          element.includes("Сертификат на газификацию") ||
          element.includes("Ежемесячная денежная выплата (рег)"))
      ) {
        countCommon++;
        sheetTempCommon.addRow(row.values);
      } else if (
        i === 13 &&
        typeof element === "string" &&
        element.includes("Отчет о выполнении программы социальной адаптации")
      ) {
        countAdaptation++;
        sheetTempAdaptation.addRow(row.values);
      } else if (
        i === 13 &&
        typeof element === "string" &&
        (element.includes("(ветераны)") ||
          element.includes("(инвалиды)") ||
          element.includes("ЕДК(факт)") ||
          element.includes("(без заявления)") ||
          element.includes(
            "Оформление (выдача) удостоверения многодетной семьи"
          ) ||
          element.includes("Субсидии на оплату жилья и ЖКУ"))
      ) {
        countEDK++;
        sheetTempEDK.addRow(row.values);
      } else if (
        i === 13 &&
        typeof element === "string" &&
        element.includes(
          "Ежемесячная денежная выплата на ребенка в возрасте от трех до семи лет включительно"
        )
      ) {
        count37++;
        sheetTemp37.addRow(row.values);
      } else if (
        i === 13 &&
        typeof element === "string" &&
        (element.includes("Выдача дубликата удостоверения Ветеран труда") ||
          element.includes("Выдача удост. ветерана ВОВ тружеников тыла") ||
          element.includes(
            "Выдача удост. ВТ, им. продолжительный стаж работы (модерниз.)"
          ) ||
          element.includes("Выдача удост. инвалида о праве на льготы") ||
          element.includes("Выдача удостоверения Ветеран труда") ||
          element.includes(
            "Выдача удостоверения ВТ, имеющего продолжительный стаж работы"
          ) ||
          element.includes(
            "Замена удостоверения «Ветеран труда, имеющий продолжительный стаж работы» в связи с опечаткой (ошибкой), допущенной при оформлении удостоверения"
          ) ||
          element.includes(
            "Оформление (выдача) удостоверения члена семьи погиб. (умерш.) ВБД"
          ))
      ) {
        countVT++;
        sheetTempVT.addRow(row.values);
      } else if (
        i === 13 &&
        typeof element === "string" &&
        !element.includes("Направления обращения")
      ) {
        countUnknown++;
        sheetTempUnknown.addRow(row.values);
      }
    });

    //Do whatever you want to do with this row like inserting in db, etc
  });

  countRef > 0 ? sortByColumn(7, sheetTempRef, sheetRef) : null;
  countDec > 0 ? sortByColumn(7, sheetTempDec, sheetDec) : null;
  countBurial > 0 ? sortByColumn(7, sheetTempBurial, sheetBurial) : null;
  countASPK > 0 ? sortByColumn(7, sheetTempASPK, sheetASPK) : null;
  countNU > 0 ? sortByColumn(7, sheetTempNU, sheetNU) : null;
  countUK > 0 ? sortByColumn(7, sheetTempUK, sheetUK) : null;
  countTourism > 0 ? sortByColumn(7, sheetTempTourism, sheetTourism) : null;
  countAdaptation > 0
    ? sortByColumn(7, sheetTempAdaptation, sheetAdaptation)
    : null;
  countCommon > 0 ? sortByColumn(7, sheetTempCommon, sheetCommon) : null;
  countEDK > 0 ? sortByColumn(7, sheetTempEDK, sheetEDK) : null;
  count37 > 0 ? sortByColumn(7, sheetTemp37, sheet37) : null;
  countVT > 0 ? sortByColumn(7, sheetTempVT, sheetVT) : null;
  countUnknown > 0 ? sortByColumn(7, sheetTempUnknown, sheetUnknown) : null;

  countAll > 0 ? createStyles(sheetNewAll, countAll, "Все") : null;
  countRef > 0 ? createStyles(sheetRef, countRef, "Справки") : null;
  countDec > 0 ? createStyles(sheetDec, countDec, "По заявлению") : null;
  countBurial > 0 ? createStyles(sheetBurial, countBurial, "Погребение") : null;
  countASPK > 0 ? createStyles(sheetASPK, countASPK, "АСПК") : null;
  countNU > 0 ? createStyles(sheetNU, countNU, "Нар. университет") : null;
  countUK > 0 ? createStyles(sheetUK, countUK, "Мат. помощь срочно") : null;
  countTourism > 0
    ? createStyles(sheetTourism, countTourism, "Соц. туризм")
    : null;
  countAdaptation > 0
    ? createStyles(sheetAdaptation, countAdaptation, "Соц. адаптация")
    : null;
  countCommon > 0 ? createStyles(sheetCommon, countCommon, "Общие") : null;
  countEDK > 0 ? createStyles(sheetEDK, countEDK, "ЕДК") : null;
  count37 > 0 ? createStyles(sheet37, count37, "3-7") : null;
  countVT > 0 ? createStyles(sheetVT, countVT, "ВТ") : null;
  countUnknown > 0 ? createStyles(sheetUnknown, countUnknown, "Прочее") : null;

  countRef === 0 ? book.removeWorksheet("Справки") : null;
  countDec === 0 ? book.removeWorksheet("По заявлению") : null;
  countBurial === 0 ? book.removeWorksheet("Погребение") : null;
  countASPK === 0 ? book.removeWorksheet("АСПК") : null;
  countNU === 0 ? book.removeWorksheet("НУ") : null;
  countUK === 0 ? book.removeWorksheet("Мат. помощь") : null;
  countTourism === 0 ? book.removeWorksheet("Соц. туризм") : null;
  countAdaptation === 0 ? book.removeWorksheet("Соц. адаптация") : null;
  countCommon === 0 ? book.removeWorksheet("Общие") : null;
  countEDK === 0 ? book.removeWorksheet("ЕДК") : null;
  count37 === 0 ? book.removeWorksheet("3-7") : null;
  countVT === 0 ? book.removeWorksheet("ВТ") : null;
  countUnknown === 0 ? book.removeWorksheet("Прочее") : null;

  book.removeWorksheet("Справки временно");
  book.removeWorksheet("По заявлению временно");
  book.removeWorksheet("Погребение временно");
  book.removeWorksheet("АСПК временно");
  book.removeWorksheet("НУ временно");
  book.removeWorksheet("Мат. помощь временно");
  book.removeWorksheet("Соц. туризм временно");
  book.removeWorksheet("Соц. адаптация временно");
  book.removeWorksheet("Общие временно");
  book.removeWorksheet("ЕДК временно");
  book.removeWorksheet("3-7 временно");
  book.removeWorksheet("ВТ временно");
  book.removeWorksheet("Прочее временно");
  book.removeWorksheet("Sheet0");

  district = sheetNewAll.getCell("O3").value;

  createStatistics(sheetStatistics, district);

  await book.xlsx.writeFile(path.join(__dirname, `../uploads/result.xlsx`));

  headers = null;

  countAll = 0;
  countRef = 0;
  countBurial = 0;
  countASPK = 0;
  countNU = 0;
  countUK = 0;
  countTourism = 0;
  countAdaptation = 0;
  countCommon = 0;
  count37 = 0;
  countDec = 0;
  countEDK = 0;
  countVT = 0;
  countUnknown = 0;

  deleteTempFiles(filename[0]);

  console.log("Формирование шаблона завершено.");

  return district;
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

    for (let i = 0; i < rows.length; i++) {
      newWorkSheet.addRow(rows[i]);
    }
  }
};

const createStyles = (sheet, countReq, title) => {
  sheet.spliceRows(1, 0, [`${title} из регистра карточек обращений`]);
  sheet.spliceRows(2, 0, headers);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();

  sheet.spliceColumns(1, 0, []);
  sheet.getCell("A2").value = "№";

  for (let i = 1; i - 1 < countReq; i++) {
    sheet.getCell(`A${i + 2}`).value = i;
    sheet.getCell(`A${i + 2}`).font = {
      name: "Times New Roman",
      size: 12,
      bold: true,
    };
    sheet.getCell(`A${i + 2}`).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    sheet.getCell(`A${i + 2}`).alignment = {
      wrapText: true,
      vertical: "middle",
      horizontal: "center",
    };
  }

  sheet.mergeCells("A1:O1");

  sheet.getCell("A1").border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };

  sheet.getCell("A1").font = {
    name: "Times New Roman",
    size: 20,
    bold: true,
  };

  sheet.getCell("A1").alignment = {
    horizontal: "center",
  };

  if (month + 1 < 10) {
    if (day < 10) {
      sheet.getCell(
        "A1"
      ).value = `${title} из регистра карточек обращений; Дата создания списка: 0${day}.0${
        month + 1
      }.${year};  Всего карточек: ${countReq}; Выполнил: Грешняков Д.В.`;
    } else {
      sheet.getCell(
        "A1"
      ).value = `${title} из регистра карточек обращений; Дата создания списка: ${day}.0${
        month + 1
      }.${year};  Всего карточек: ${countReq}; Выполнил: Грешняков Д.В.`;
    }
  } else {
    if (day < 10) {
      sheet.getCell(
        "A1"
      ).value = `${title} из регистра карточек обращений; Дата создания списка: 0${day}.${
        month + 1
      }.${year};  Всего карточек: ${countReq}; Выполнил: Грешняков Д.В.`;
    } else {
      sheet.getCell(
        "A1"
      ).value = `${title} из регистра карточек обращений; Дата создания списка: ${day}.${
        month + 1
      }.${year};  Всего карточек: ${countReq}; Выполнил: Грешняков Д.В.`;
    }
  }
  sheet.getRow(2).eachCell(function (cell, cellNumber) {
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    cell.font = {
      name: "Times New Roman",
      size: 12,
      bold: true,
    };
    cell.alignment = {
      wrapText: true,
      vertical: "middle",
      horizontal: "center",
    };
  });

  sheet.getRows(3, countReq).forEach((row, numRow) => {
    row.eachCell(function (cell, cellNumber) {
      if (cellNumber !== 1) {
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
      }
    });
  });

  sheet.getColumn(1).width = 3;
  sheet.getColumn(2).width = 7.86;
  sheet.getColumn(3).width = 7.86;
  sheet.getColumn(4).width = 17.43;
  sheet.getColumn(5).width = 13.57;
  sheet.getColumn(6).width = 13.57;
  sheet.getColumn(7).width = 13.57;
  sheet.getColumn(8).width = 20.71;
  sheet.getColumn(9).width = 10;
  sheet.getColumn(10).width = 13.57;
  sheet.getColumn(11).width = 27.86;
  sheet.getColumn(12).width = 20.71;
  sheet.getColumn(13).width = 13.57;
  sheet.getColumn(14).width = 27.86;
  sheet.getColumn(15).width = 13.57;

  sheet.getRow(2).height = 42.75;

  sheet.getRows(3, countReq).forEach((row, numRow) => {
    row.height = 63.75;
  });

  sheet.pageSetup.orientation = "landscape";
  sheet.pageSetup.paperSize = 9;
  sheet.pageSetup.printArea = `A1:O${countReq + 2}`;
  sheet.pageSetup.fitToPage = true;
  sheet.pageSetup.fitToWidth = 1;
  sheet.pageSetup.fitToHeight = 0;
};

const createStatistics = (sheet, district) => {
  sheet.getCell("A1").value = "Район";
  sheet.getCell("B1").value = "Всего";
  sheet.getCell("C1").value = "Справки";
  sheet.getCell("D1").value = "Погребение";
  sheet.getCell("E1").value = "АСПК";
  sheet.getCell("F1").value = "Иное";
  sheet.getCell("G1").value = "Общие";
  sheet.getCell("H1").value = "ЕДВ 3-7";
  sheet.getCell("I1").value = "По заявлению";
  sheet.getCell("J1").value = "ЕДК";
  sheet.getCell("K1").value = "ВТ";

  sheet.getCell("A2").value = district;
  sheet.getCell("B2").value = countAll;
  sheet.getCell("C2").value = countRef;
  sheet.getCell("D2").value = countBurial;
  sheet.getCell("E2").value = countASPK;
  countNU !== 0 ||
  countUK !== 0 ||
  countTourism !== 0 ||
  countAdaptation !== 0 ||
  countUnknown !== 0
    ? (sheet.getCell("F2").value = `
    Нар. университет ${countNU};
    Мат. пом. срочно ${countUK};
    Соц. туризм ${countTourism};
    Соц. адаптация ${countAdaptation};
    Прочее ${countUnknown};
  
  `)
    : (sheet.getCell("F2").value = 0);
  sheet.getCell("G2").value = countCommon;
  sheet.getCell("H2").value = count37;
  sheet.getCell("I2").value = countDec;
  sheet.getCell("J2").value = countEDK;
  sheet.getCell("K2").value = countVT;

  sheet.getColumn(1).width = 17.86;
  sheet.getColumn(6).width = 30;

  sheet.eachRow((row, rowNumber) => {
    row.eachCell((cell, i) => {
      cell.alignment = {
        wrapText: true,
        vertical: "middle",
        horizontal: "center",
      };

      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      cell.font = {
        name: "Times New Roman",
        size: 12,
        bold: true,
      };
    });
  });
};

const deleteTempFiles = (filename) => {
  if (fs.existsSync(path.join(__dirname, "../uploads/", filename))) {
    fs.unlink(path.join(__dirname, "../uploads/", filename), (e) => {
      if (e) {
        console.log(e);
      } else {
        console.log("Файл " + filename + " был удален из временной директории");
      }
    });
    fs.unlink(path.join(__dirname, "../uploads/changeFormat.xlsx"), (e) => {
      if (e) {
        console.log(e);
      } else {
        console.log(
          "Файл changeFormat.xlsx был удален из временной директории"
        );
      }
    });
  }
};

module.exports = listing;
