const container = $(".container-fluid #board-ctn .post-content");
const [targetDom = null] = container;
if (targetDom) {
  const div = document.createElement("div");
  div.innerHTML = `<br><div id="waline"></div>`;
  targetDom.append(div);
}
