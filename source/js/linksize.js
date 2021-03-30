window.onload = function () {
  const bg = document.querySelector("#web_bg");
  const div = document.createElement("div");
  div.innerHTML = "<p>123456789</p>";
  bg.append(div);
  console.log("Go: window.onload -> bg", bg);
};
