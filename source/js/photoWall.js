var imgDataPath = "/blog/photos/photos.json"; //图片名称高宽信息json文件路径
var imgPath = "https://cdn.jsdelivr.net/gh/Cenergy/images-bed/images/"; //图片访问路径
var imgMaxNum = 50; //图片显示数量

var windowWidth =
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;
if (windowWidth < 768) {
  var imageWidth = 145; //图片显示宽度(手机端)
} else {
  var imageWidth = 250; //图片显示宽度
}

const photo = {
  page: 1,
  offset: imgMaxNum,
  init: function () {
    var that = this;
    $.getJSON(imgDataPath, function (data) {
      that.render(that.page, data);
      //that.scroll(data);
      that.eventListen(data);
    });
  },
  constructHtml(options) {
    const { imageWidth, imageX, imageY, imgPath,imgName, imgNameWithPattern } = options;
    const htmlEle = `<div class="card lozad" style="width:${imageWidth}px">
                  <div class="ImageInCard" style="height:${
                    (imageWidth * imageY) / imageX
                  }px">
                    <a data-fancybox="gallery" href="${imgPath}${imgNameWithPattern}"
                          data-caption="${imgName}" title="${imgName}">
                            <img  class="lazyload" data-src="${imgPath}${imgNameWithPattern}"
                            src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                            onload="lzld(this)"
                            lazyload="auto">
                        </a>
                  </div>
                </div>`;
    return htmlEle;
  },
  render: function (page, data = []) {
    this.data = data;
    var begin = (page - 1) * this.offset;
    var end = page * this.offset;
    if (begin >= data.length) return;
    var html,
      imgNameWithPattern,
      imgName,
      imageSize,
      imageX,
      imageY,
      li = "";

    let liHtml = "";
    let contentHtml = "";

    data.forEach((item, index) => {
      const { children = [] } = item;
      const activeClass = index === 0 ? "active" : "";
      const contentActiveClass = index === 0 ? "show active" : "";
      liHtml += `<li class="nav-item" role="presentation">
          <a class="nav-link ${activeClass}" id="home-tab" photo-uuid="${item.name}" data-toggle="tab" href="#${item.name}"  role="tab" aria-controls="${item.name}" aria-selected="true">${item.name}</a>
        </li>`;
      for (var i = begin; i < end && i < children.length; i++) {
        imgNameWithPattern = children[i].split(" ")[1];
        imgName = imgNameWithPattern.split(".")[0];
        imageSize = children[i].split(" ")[0];
        imageX = imageSize.split(".")[0];
        imageY = imageSize.split(".")[1];
        let imgOptions = {
          imageWidth,
          imageX,
          imageY,
          imgPath,
          imgName,
          imgNameWithPattern,
        };
        li += this.constructHtml(imgOptions);
      }
      contentHtml += ` <div class="tab-pane fade ${contentActiveClass}" id="${item.name}" role="tabpanel" aria-labelledby="home-tab">${li}</div>`;
    });
    const ulHtml = `<ul class="nav nav-tabs" id="myTab" role="tablist">${liHtml}</ul><div id="helloTest"></div>`;
    const tabContent = `<div class="tab-content" id="myTabContent">${contentHtml}</div>`;
    const composeHtml = ulHtml + tabContent;

    $("#imageTab").append(ulHtml);
    $(".ImageGrid").append(tabContent);
    this.minigrid();
  },
  eventListen: function (data) {
    let self = this;
    var html,
      imgNameWithPattern,
      imgName,
      imageSize,
      imageX,
      imageY,
      li = "";
    $('a[data-toggle="tab"]').on("shown.bs.tab", function (e) {
      $(".ImageGrid").empty();
      const selectId = $(e.target).attr("photo-uuid");
      const selectedData = data.find((data) => data.name === selectId) || {};
      const { children } = selectedData;
      let li = "";
      children.forEach((item, index) => {
        imgNameWithPattern = item.split(" ")[1];
        imgName = imgNameWithPattern.split(".")[0];
        imageSize = item.split(" ")[0];
        imageX = imageSize.split(".")[0];
        imageY = imageSize.split(".")[1];
        let imgOptions = {
          imageWidth,
          imageX,
          imageY,
          imgName,
          imgPath,
          imgNameWithPattern,
        };
        li += self.constructHtml(imgOptions);
      });
      $(".ImageGrid").append(li);
      self.minigrid();
    });
  },
  minigrid: function () {
    var grid = new Minigrid({
      container: ".ImageGrid",
      item: ".card",
      gutter: 12,
    });
    grid.mount();
    $(window).resize(function () {
      grid.mount();
    });
  },
};
photo.init();
