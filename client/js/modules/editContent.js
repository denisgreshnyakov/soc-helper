const ip = "10.51.11.3";
const port = "80";
const version = "1.2.0";

const editContent = () => {
  const links = document.querySelectorAll(".nav-link");
  const v = document.querySelector(".navbar-text");

  v.innerHTML = `Версия ${version}`;

  links.forEach((item) => {
    item.host = `${ip}:${port}`;
  });
};

export { editContent, ip, port };
