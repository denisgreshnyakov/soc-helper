window.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  const spanUploadFiles = document.querySelector(".span-upload-files");
  const spinnerUpload = document.querySelectorAll(".spinner-upload");

  const resultBlock = document.querySelector(".result");

  const fileReq = document.getElementById("file-request");
  const fileAn = document.getElementById("file-answer");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    animationDownload();

    //http://192.168.1.27:80/uploads
    fetch("http://192.168.0.103:80/join", {
      method: "POST",
      body: JSON.stringify({
        yes: "yes",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        resultBlock.innerHTML = "";
        console.log(data);
      })
      .catch((err) => {
        showResult(`Ошибка клиента при отправке файлов на сервер. ${err}`);
      });
    e.target.reset();
  });

  const animationDownload = () => {
    resultBlock.innerHTML = `
    <div class="spinner">
    <div class="dot dot1"></div>
    <div class="dot dot2"></div>
    <div class="dot dot3"></div>
    <div class="dot dot4"></div>
    </div>
`;
  };
});
