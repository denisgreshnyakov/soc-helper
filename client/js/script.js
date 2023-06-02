window.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  const spanUploadFiles = document.querySelector(".span-upload-files");
  const spinnerUpload = document.querySelectorAll(".spinner-upload");

  const resultBlock = document.querySelector(".result");
  const inputBlock = document.querySelector(".input");

  const fileReq = document.getElementById("file-request");
  const fileAn = document.getElementById("file-answer");

  //загрузить и сравнить
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    fixHeight();

    spanUploadFiles.style = "display: none";
    spinnerUpload[0].style = "display: inline-block";
    spinnerUpload[1].style = "display: inline-block";

    const formData = new FormData();

    formData.append("files", fileReq.files[0]);
    formData.append("files", fileAn.files[0]);

    //http://192.168.1.27:80/uploads
    fetch("http://192.168.1.27:80/uploads", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Данные после обработки: ");
        console.log(data);

        if (data.hasOwnProperty("error")) {
          showResult(data.message);
        } else {
          showResult(`Количество неотвеченных запросов: ${data.length}`);

          if (data.length > 0) {
            showTable(data);
            downloadResult();
          }
        }
      })
      .catch((err) => {
        showResult(`Ошибка клиента при отправке файлов на сервер. ${err}`);
      });
    e.target.reset();
  });

  const downloadResult = async () => {
    try {
      const response = await fetch("http://192.168.1.27:80/uploads");
      if (response.status === 200) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "result.xlsx";
        document.body.append(link);
        link.click();
        link.remove();
      } else if (response.status === 500) {
        showResult(`Ошибка отправки файла на клиент: ${response.status}`);
      }
    } catch (e) {
      showResult(
        `Ошибка клиента при попытке загрузить файл результата сравнения. ${e}`
      );
    }
  };

  const showResult = (message) => {
    resultBlock.innerHTML = "";
    resultBlock.style = "min-height: 24.45vh;";

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
    resultBlock.style = `
      min-height: 19.45vh;
      margin-bottom: 50px;
      display: block;
  `;
  };

  const fixHeight = () => {
    inputBlock.style = `
    min-height: 70.4vh;
    display: flex;
    flex-direction: column;
    justify-content: end;
    position: relative;
    `;

    resultBlock.style = `
    position: relative;
    min-height: 19.45vh;
`;

    resultBlock.innerHTML = `
    <div class="spinner">
    <div class="dot dot1"></div>
    <div class="dot dot2"></div>
    <div class="dot dot3"></div>
    <div class="dot dot4"></div>
    </div>
`;
  };

  const btnUp = {
    el: document.querySelector(".btn-up"),
    show() {
      // удалим у кнопки класс btn-up_hide
      this.el.classList.remove("btn-up_hide");
    },
    hide() {
      // добавим к кнопке класс btn-up_hide
      this.el.classList.add("btn-up_hide");
    },
    addEventListener() {
      // при прокрутке содержимого страницы
      window.addEventListener("scroll", () => {
        // определяем величину прокрутки
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        // если страница прокручена больше чем на 400px, то делаем кнопку видимой, иначе скрываем
        scrollY > 400 ? this.show() : this.hide();
      });
      // при нажатии на кнопку .btn-up
      document.querySelector(".btn-up").onclick = () => {
        // переместим в начало страницы
        setTimeout(function () {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
        }, 300);
      };
    },
  };

  btnUp.addEventListener();
});
