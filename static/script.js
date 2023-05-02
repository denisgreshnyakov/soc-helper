const btn = document.querySelector("button");

btn.addEventListener("click", async () => {
  console.log("i am working");
  const response = await fetch("http://localhost:3000", {
    method: "POST",
    body: "Tom Smith",
  });
  const responseText = await response.text();
  console.log(responseText);
});
