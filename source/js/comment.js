const container = $(".container-fluid #board-ctn .post-content");
const [targetDom = null] = container;
if (targetDom) {
  const div = document.createElement("div");
  div.innerHTML = "123123123";
  div.id = "waline";
  targetDom.append(div);
}
