import { showResult, showTable, animationDownload } from "../modules/show";

const formCompare = document.querySelector(".formCompare");
const formJoin = document.querySelector(".formJoin");
const formList = document.querySelector(".formList");

const fileReq = document.getElementById("file-request");
const fileAn = document.getElementById("file-answer");

let forResultName = {
  POSTAV: "",
  MONTH_S: "",
  YEAR_S: "",
};

const submitComparingData = (ip, port) => {
  if (formCompare !== null) {
    formCompare.addEventListener("submit", (e) => {
      e.preventDefault();

      animationDownload();

      const formData = new FormData();

      formData.append("files", fileReq.files[0]);
      formData.append("files", fileAn.files[0]);

      let status;

      fetch(`http://${ip}:${port}/compare`, {
        method: "POST",
        body: formData,
      })
        .then((res) => {
          status = res.status;
          return res.json();
        })
        .then((data) => {
          if (status === 500) {
            showResult(data.message);
          } else {
            showResult(`Количество неотвеченных запросов: ${data.length}`);

            if (data.length > 0) {
              forResultName.POSTAV = data[0]["POSTAV"];
              forResultName.MONTH_S = data[0]["MONTH_S"];
              forResultName.YEAR_S = data[0]["YEAR_S"];
              showTable(data);
              downloadResult("compare", ip, port);
            }
          }
        })
        .catch((err) => {
          showResult(`Ошибка при отправке файлов на сервер. ${err}`);
        });
      e.target.reset();
    });
  }
};

const submitJoiningData = (ip, port) => {
  if (formJoin !== null) {
    formJoin.addEventListener("submit", (e) => {
      e.preventDefault();

      animationDownload();

      const formData = new FormData();

      formData.append("files", fileReq.files[0]);

      let status;

      fetch(`http://${ip}:${port}/join`, {
        method: "POST",
        body: formData,
      })
        .then((res) => {
          status = res.status;
          return res.json();
        })
        .then((data) => {
          showResult(data.join);
          if (status === 200) {
            downloadResult("join", ip, port);
          }
        })
        .catch((err) => {
          showResult(`Ошибка клиента при отправке файлов на сервер. ${err}`);
        });
      e.target.reset();
    });
  }
};

const submitListingData = (ip, port) => {
  if (formList !== null) {
    formList.addEventListener("submit", (e) => {
      e.preventDefault();

      animationDownload();

      const formData = new FormData();

      formData.append("files", fileReq.files[0]);

      let status;

      fetch(`http://${ip}:${port}/list`, {
        method: "POST",
        body: formData,
      })
        .then((res) => {
          status = res.status;
          return res.json();
        })
        .then((data) => {
          showResult(data.join);
          if (status === 200) {
            downloadResult("list", ip, port);
            showResult(`Формирование шаблона успешно завершено.`);
          }
        })
        .catch((err) => {
          showResult(`Ошибка клиента при отправке файлов на сервер. ${err}`);
        });
      e.target.reset();
    });
  }
};

const downloadResult = async (type, ip, port) => {
  try {
    const response = await fetch(`http://${ip}:${port}/uploads`);
    if (response.status === 200) {
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      if (type === "compare") {
        link.download = `Результат_сравнения_${forResultName.POSTAV}_${forResultName.MONTH_S}_${forResultName.YEAR_S}.xlsx`;
      } else if (type === "join") {
        link.download = `Результат объединения.xlsx`;
      } else if (type === "list") {
        const today = new Date();
        const now = today.toLocaleString();

        link.download = `Список ТИ на ${now}.xlsx`;
      }
      document.body.append(link);
      link.click();
      link.remove();
    } else if (response.status === 500) {
      showResult(
        `Ошибка сервера при отправке файла на клиент: ${response.status}`
      );
    }
  } catch (e) {
    if (type === "compare") {
      showResult(
        `Ошибка клиента при попытке загрузить файл результата сравнения. ${e}`
      );
    } else if (type === "join") {
      showResult(
        `Ошибка клиента при попытке загрузить файл результата объединения. ${e}`
      );
    } else if (type === "list") {
      showResult(
        `Ошибка клиента при попытке загрузить файл списка для ТИ. ${e}`
      );
    }
  }
};

export { submitComparingData, submitJoiningData, submitListingData };
