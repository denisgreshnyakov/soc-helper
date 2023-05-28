const XLSX = require("xlsx");
const fs = require("fs");

const data = [];
const result = [];
const NNN = [];

const compare = (filename) => {
  data.splice(0, data.length);
  result.splice(0, result.length);
  NNN.splice(0, NNN.length);

  filename.forEach((elem, i) => {
    console.log("reading " + i + " file: " + elem);
    const workbook = XLSX.readFile(__dirname + "/uploads/" + elem);

    let workssheet = workbook.Sheets[workbook.SheetNames[0]];

    data.push(XLSX.utils.sheet_to_json(workssheet));

    fs.unlink(__dirname + "/uploads/" + elem, (err) => {
      if (err) throw err;
      console.log("file " + elem + " has been deleted");
    });
  });

  console.log("start comparing");

  for (let j = 0; j < data[1].length; j++) {
    NNN.push(Number(data[1][j].NNN));
  }

  for (let i = 0; i < data[0].length; i++) {
    if (!NNN.includes(Number(data[0][i].NNN))) {
      result.push(data[0][i]);
    }
  }

  const workSheet = XLSX.utils.json_to_sheet(result);
  const workBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workBook, workSheet, "Отсутствуют ответы");
  XLSX.writeFile(workBook, __dirname + "/uploads/result.xlsx");

  console.log("finish comparing");

  return result;
};

module.exports = compare;
