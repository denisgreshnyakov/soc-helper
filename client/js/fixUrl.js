window.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".nav-link");
  const ip = "192.168.0.103";
  const port = "80";
  links.forEach((item) => {
    item.host = `${ip}:${port}`;
  });
});
