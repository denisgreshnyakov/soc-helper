const form = document.querySelector("form");
const compare = document.querySelector("#compare");

form.addEventListener("submit", (e) => {
  e.preventDefault();

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
    .then((data) => console.log(data));
  e.target.reset();
});

compare.addEventListener("click", () => {
  fetch("http://127.0.0.1:5000/", {
    method: "POST",
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
});
