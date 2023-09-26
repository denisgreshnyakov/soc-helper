const ip = "192.168.1.27";
const port = "80";
const version = "1.1.1";

const editContent = () => {
  const links = document.querySelectorAll(".nav-link");
  const v = document.querySelector(".navbar-text");

  v.innerHTML = `Версия ${version}`;

  links.forEach((item) => {
    item.host = `${ip}:${port}`;
  });
};

export { editContent, ip, port };
