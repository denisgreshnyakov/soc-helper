const spanUploadFiles = document.querySelector(".span-upload-files");
const spinnerUpload = document.querySelectorAll(".spinner-upload");
const resultBlock = document.querySelector(".result");

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
  const table = document.createElement("div");
  table.innerHTML = `<table class="table"></table>`;
  resultBlock.appendChild(table);

  let header = document.createElement("tr");

  for (let key in data[0]) {
    header.innerHTML += `<th>${key}</th>`;
  }
  document.querySelector(".table").appendChild(header);

  data.forEach((elem, i) => {
    let row = document.createElement("tr");
    for (let key in elem) {
      row.innerHTML += `<td>${elem[key]}</td>`;
    }
    document.querySelector(".table").appendChild(row);
  });
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

export { showResult, showTable, animationDownload };
