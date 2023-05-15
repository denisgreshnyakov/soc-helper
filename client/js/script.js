const form = document.querySelector("form");
const compare = document.querySelector("#compare");

const spanUploadFiles = document.querySelector(".span-upload-files");
const spanCompareFiles = document.querySelector(".span-compare-files");
const spinnerUpload = document.querySelectorAll(".spinner-upload");
const spinnerCompare = document.querySelectorAll(".spinner-compare");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  spanUploadFiles.style = "display: none";
  spinnerUpload[0].style = "display: inline-block";
  spinnerUpload[1].style = "display: inline-block";

  const fileReq = document.getElementById("file-request");
  const fileAn = document.getElementById("file-answer");
  const formData = new FormData();

  formData.append("files", fileReq.files[0]);
  formData.append("files", fileAn.files[0]);

  console.log(...formData);

  fetch("http://192.168.1.27:80/uploads", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .then(() => {
      spanUploadFiles.style = "display: block";
      spinnerUpload[0].style = "display: none";
      spinnerUpload[1].style = "display: none";
    });
  e.target.reset();
});

compare.addEventListener("click", () => {
  spanCompareFiles.style = "display: none";
  spinnerCompare[0].style = "display: inline-block";
  spinnerCompare[1].style = "display: inline-block";
  fetch("http://192.168.1.27:80/", {
    method: "POST",
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .then(downloadResult())
    .then(() => {
      spanCompareFiles.style = "display: block";
      spinnerCompare[0].style = "display: none";
      spinnerCompare[1].style = "display: none";
    });
});

const downloadResult = async () => {
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
  }
};
