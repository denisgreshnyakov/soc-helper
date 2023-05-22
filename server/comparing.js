const XLSX = require("xlsx");
const fs = require("fs");
// const ExcelJS = require("exceljs");

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

  // console.log(result.length);
  // for (let i = 1; i <= 2; i++) {
  //   const NNN = workssheet[`A${i}`].v;
  //   const K_RAION = workssheet[`B${i}`].v;
  //   const POSTAV = workssheet[`C${i}`].v;
  //   const UPID = workssheet[`D${i}`].v;
  //   const LSHET = workssheet[`E${i}`].v;
  //   const E_LSHET = workssheet[`F${i}`].v;
  //   const ORG_RACH = workssheet[`G${i}`].v;
  //   const UOID = workssheet[`H${i}`].v;
  //   const LSHET_R = workssheet[`I${i}`].v;
  //   const POST_IND = workssheet[`J${i}`].v;
  //   const CITY = workssheet[`K${i}`].v;
  //   const SOCR_CITY = workssheet[`L${i}`].v;
  //   const STREET = workssheet[`M${i}`].v;
  //   const SOCR_STR = workssheet[`N${i}`].v;
  //   const DOM = workssheet[`O${i}`].v;
  //   const KORP = workssheet[`P${i}`].v;
  //   const KV = workssheet[`Q${i}`].v;
  //   const KOMNATA = workssheet[`R${i}`].v;
  //   const KLADR_STR = workssheet[`S${i}`].v;
  //   const FIAS_CITY = workssheet[`T${i}`].v;
  //   const FIAS_STR = workssheet[`U${i}`].v;
  //   const FIAS_DOM = workssheet[`V${i}`].v;
  //   const GF = workssheet[`W${i}`].v;
  //   const OPS = workssheet[`X${i}`].v;
  //   const MOP = workssheet[`Y${i}`].v;
  //   const ETAGN = workssheet[`Z${i}`].v;
  //   const DOLYA = workssheet[`AA${i}`].v;
  //   const PL_OBSH = workssheet[`AB${i}`].v;
  //   const PL_OTAP = workssheet[`AC${i}`].v;
  //   const KOL_MANS = workssheet[`AD${i}`].v;
  //   const KOL_MANV = workssheet[`AE${i}`].v;
  //   const YEAR_S = workssheet[`AF${i}`].v;
  //   const MONTH_S = workssheet[`AG${i}`].v;
  //   const VID_USL = workssheet[`AH${i}`].v;
  //   const NAME_USL = workssheet[`AI${i}`].v;
  //   const MEASURE = workssheet[`AJ${i}`].v;
  //   const NORM_USL = workssheet[`AK${i}`].v;
  //   const KNORM_USL = workssheet[`AL${i}`].v;
  //   const TARIF = workssheet[`AM${i}`].v;
  //   const KOL_POTR = workssheet[`AN${i}`].v;
  //   const NACHISL = workssheet[`AO${i}`].v;
  //   const NACH_PVK = workssheet[`AP${i}`].v;
  //   const KOPLATE = workssheet[`AQ${i}`].v;
  //   const OPLATA = workssheet[`AR${i}`].v;
  //   const PERERASCH = workssheet[`AS${i}`].v;
  //   const DOLG_SUM = workssheet[`AT${i}`].v;
  //   const DOLG_MONTH = workssheet[`AU${i}`].v;
  //   const SOGL_DOLG = workssheet[`AV${i}`].v;
  //   const MKV = workssheet[`AW${i}`].v;
  //   const GODPOSTR = workssheet[`AX${i}`].v;
  //   const PRIBUCH = workssheet[`AY${i}`].v;
  //   const Comment = workssheet[`AZ${i}`].v;

  //   console.log(workssheet[`A${3}`].v);

  //   console.log({
  //     NNN: NNN,
  //     K_RAION: K_RAION,
  //     POSTAV: POSTAV,
  //     UPID: UPID,
  //     LSHET: LSHET,
  //     E_LSHET: E_LSHET,
  //     ORG_RACH: ORG_RACH,
  //     UOID: UOID,
  //     LSHET_R: LSHET_R,
  //     POST_IND: POST_IND,
  //     CITY: CITY,
  //     SOCR_CITY: SOCR_CITY,
  //     STREET: STREET,
  //     SOCR_STR: SOCR_STR,
  //     DOM: DOM,
  //     KORP: KORP,
  //     KV: KV,
  //     KOMNATA: KOMNATA,
  //     KLADR_STR: KLADR_STR,
  //     FIAS_CITY: FIAS_CITY,
  //     FIAS_STR: FIAS_STR,
  //     FIAS_DOM: FIAS_DOM,
  //     GF: GF,
  //     OPS: OPS,
  //     MOP: MOP,
  //     ETAGN: ETAGN,
  //     DOLYA: DOLYA,
  //     PL_OBSH: PL_OBSH,
  //     PL_OTAP: PL_OTAP,
  //     KOL_MANS: KOL_MANS,
  //     KOL_MANV: KOL_MANV,
  //     YEAR_S: YEAR_S,
  //     MONTH_S: MONTH_S,
  //     VID_USL: VID_USL,
  //     NAME_USL: NAME_USL,
  //     MEASURE: MEASURE,
  //     NORM_USL: NORM_USL,
  //     KNORM_USL: KNORM_USL,
  //     TARIF: TARIF,
  //     KOL_POTR: KOL_POTR,
  //     NACHISL: NACHISL,
  //     NACH_PVK: NACH_PVK,
  //     KOPLATE: KOPLATE,
  //     OPLATA: OPLATA,
  //     PERERASCH: PERERASCH,
  //     DOLG_SUM: DOLG_SUM,
  //     DOLG_MONTH: DOLG_MONTH,
  //     SOGL_DOLG: SOGL_DOLG,
  //     MKV: MKV,
  //     GODPOSTR: GODPOSTR,
  //     PRIBUCH: PRIBUCH,
  //     Comment: Comment,
  //   });
  // }
};

module.exports = compare;

//467710
