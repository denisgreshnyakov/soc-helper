window.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  const spanUploadFiles = document.querySelector(".span-upload-files");
  const spinnerUpload = document.querySelectorAll(".spinner-upload");

  const resultBlock = document.querySelector(".result");

  const fileReq = document.getElementById("file-request");
  const fileAn = document.getElementById("file-answer");

  let forResultName = {
    POSTAV: "",
    MONTH_S: "",
    YEAR_S: "",
  };

  //загрузить и сравнить
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    animationDownload();

    const formData = new FormData();

    formData.append("files", fileReq.files[0]);
    formData.append("files", fileAn.files[0]);

    //http://192.168.1.27:80/uploads
    fetch("http://192.168.0.103:80/", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.hasOwnProperty("error")) {
          showResult(data.message);
        } else {
          showResult(`Количество неотвеченных запросов: ${data.length}`);

          if (data.length > 0) {
            showTable(data);
            downloadResult(forResultName);
          }
        }
      })
      .catch((err) => {
        showResult(`Ошибка при отправке файлов на сервер. ${err}`);
      });
    e.target.reset();
  });

  const downloadResult = async (forResultName) => {
    try {
      const response = await fetch("http://192.168.0.103:80/uploads");
      if (response.status === 200) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `Результат_сравнения_${forResultName.POSTAV}_${forResultName.MONTH_S}_${forResultName.YEAR_S}.xlsx`;
        document.body.append(link);
        link.click();
        link.remove();
      } else if (response.status === 500) {
        showResult(
          `Ошибка сервера при отправке файла на клиент: ${response.status}`
        );
      }
    } catch (e) {
      showResult(
        `Ошибка клиента при попытке загрузить файл результата сравнения. ${e}`
      );
    }
  };

  const animationDownload = () => {
    resultBlock.innerHTML = `
    <div class="spinner">
    <div class="dot dot1"></div>
    <div class="dot dot2"></div>
    <div class="dot dot3"></div>
    <div class="dot dot4"></div>
    </div>
`;

    spanUploadFiles.style = "display: none";
    spinnerUpload[0].style = "display: inline-block";
    spinnerUpload[1].style = "display: inline-block";
  };

  const showResult = (message) => {
    resultBlock.innerHTML = "";

    const label = document.createElement("div");
    label.classList.add("label");
    label.innerHTML = `
        <h2>Результат: </h2>
        <span>${message}</span>
        `;
    resultBlock.appendChild(label);
    spanUploadFiles.style = "display: block";
    spinnerUpload[0].style = "display: none";
    spinnerUpload[1].style = "display: none";
  };

  const showTable = (data) => {
    forResultName.POSTAV = data[0]["POSTAV"];
    forResultName.MONTH_S = data[0]["MONTH_S"];
    forResultName.YEAR_S = data[0]["YEAR_S"];

    const table = document.createElement("div");
    table.innerHTML = `<table class="table"></table>`;
    resultBlock.appendChild(table);

    let header = document.createElement("tr");
    for (key in data[0]) {
      header.innerHTML += `<th>${key}</th>`;
    }
    document.querySelector(".table").appendChild(header);

    data.forEach((elem, i) => {
      let row = document.createElement("tr");
      for (key in elem) {
        row.innerHTML += `<td>${elem[key]}</td>`;
      }
      document.querySelector(".table").appendChild(row);
    });
  };
});
