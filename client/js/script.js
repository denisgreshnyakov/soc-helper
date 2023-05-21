const form = document.querySelector("form");
const compare = document.querySelector("#compare");

const spanUploadFiles = document.querySelector(".span-upload-files");
const spanCompareFiles = document.querySelector(".span-compare-files");
const spinnerUpload = document.querySelectorAll(".spinner-upload");
const spinnerCompare = document.querySelectorAll(".spinner-compare");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  document.querySelector(".result").innerHTML = `
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

  const fileReq = document.getElementById("file-request");
  const fileAn = document.getElementById("file-answer");
  const formData = new FormData();

  formData.append("files", fileReq.files[0]);
  formData.append("files", fileAn.files[0]);

  console.log(...formData);

  fetch("http://127.0.0.1:5000/uploads", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      document.querySelector(".result").innerHTML = "";
      const label = document.createElement("div");
      label.classList.add("label");
      label.innerHTML = `
      <h2>Результат: </h2>
      <span>${data.message}</span>
      `;
      document.querySelector(".result").appendChild(label);
    })
    .then(() => {
      spanUploadFiles.style = "display: block";
      spinnerUpload[0].style = "display: none";
      spinnerUpload[1].style = "display: none";
    });
  e.target.reset();
});

compare.addEventListener("click", () => {
  document.querySelector(".result").innerHTML = `
  <div class="spinner">
  <div class="dot dot1"></div>
  <div class="dot dot2"></div>
  <div class="dot dot3"></div>
  <div class="dot dot4"></div>
</div>
`;

  spanCompareFiles.style = "display: none";
  spinnerCompare[0].style = "display: inline-block";
  spinnerCompare[1].style = "display: inline-block";
  fetch("http://127.0.0.1:5000/", {
    method: "POST",
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);

      document.querySelector(".result").innerHTML = "";

      const label = document.createElement("div");
      label.classList.add("label");
      label.innerHTML = `
      <h2>Результат: </h2>
      <span>Количество неотвеченных запросов: ${data.length}</span>
      `;
      document.querySelector(".result").appendChild(label);

      const table = document.createElement("div");
      table.innerHTML = `<table class="table"></table>`;
      document.querySelector(".result").appendChild(table);

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
    })
    .then(downloadResult())
    .then(() => {
      spanCompareFiles.style = "display: block";
      spinnerCompare[0].style = "display: none";
      spinnerCompare[1].style = "display: none";
    });
});

const downloadResult = async () => {
  try {
    const response = await fetch("http://127.0.0.1:5000/uploads");
    if (response.status === 200) {
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "result.xlsx";
      document.body.append(link);
      link.click();
      link.remove();
    } else {
      console.log(`File upload error: ${response.status}`);
    }
  } catch (e) {
    console.log(`Error loading comparison result type: ${e}`);
  }
};
