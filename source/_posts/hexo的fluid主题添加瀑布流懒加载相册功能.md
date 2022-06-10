---
title: hexo的fluid主题添加瀑布流懒加载相册功能
index_img: /posts/798ba833/images.jpg
abbrlink: 798ba833
date: 2021-01-10 16:57:10
tags: [Hexo,Fluid]
---
<div class="note note-warning">相册演示地址:<a style="color:red" href="https://www.aigisss.com/blog/photos/">https://www.aigisss.com/blog/photos/</a> ,当前演示环境基于hexo===5.2.0 , fluid===1.8.7,很大程度上参考了醉里挑灯赏猫的<a href="https://blog.dlzhang.com/posts/31/" style="color:red">Hexo NexT 博客增加瀑布流相册页面</a>这篇博客!在此感谢班班提供的帮助!!</div>

## 创建相册页面

新建相册页 `hexo new page photos`,编辑 `/source/photos/index.md`，输入以下内容：

```html
---
title: photos
date: 2020-12-30 19:04:03
layout: photo
---

<style>
.ImageGrid {
  width: 100%;
  max-width: 1040px;
  margin: 0 auto;
  text-align: center;
}
.card {
  overflow: hidden;
  transition: .3s ease-in-out;
  border-radius: 8px;
  background-color: #efefef;
  padding: 1.4px;
}
.ImageInCard img {
  padding: 0;
  border-radius: 8px;
  width:100%;
  height:100%;
}
@media (prefers-color-scheme: dark) {
  .card {background-color: #333;}
}
</style>

<div id="imageTab"></div>
<div class="ImageGrid"></div>

```

## 处理图片信息

为了加快图片的加载速度,我使用`GitHub` +` jsDelivr`的方式，**网上有许多的教程，此处不再演示。**文件夹结构如图:

![image-20210110205814315](hexo%E7%9A%84fluid%E4%B8%BB%E9%A2%98%E6%B7%BB%E5%8A%A0%E7%80%91%E5%B8%83%E6%B5%81%E6%87%92%E5%8A%A0%E8%BD%BD%E7%9B%B8%E5%86%8C%E5%8A%9F%E8%83%BD/image-20210110205814315.png)

主要功能是使用`image-size`( `npm i -S image-size`安装)访问照片文件夹，获取每张照片的大小和文件名，并生成对应的 `json` 文件：

`cnpm i `安装之后,把照片放在目录后，执行以下命令：

```js
node gallery/create.js
```

如果报错，请注意检查保存本地照片的文件夹里有没有非图片类文件，特别是要删除如 `.DS_Store` 这样的隐藏文件。`json` 文件样例如下：

```json
[
  {
    "name": "广州一游",
    "children": [
      "1080.1440 圣心大教堂.jpg",
      "1080.1440 广州塔顶夜晚景色.jpg",
      "1080.1440 广州塔顶夜晚景色2.jpg",
      "1080.1440 晚上广州塔.jpg",
      "1080.1443 白天广州塔.jpg"
    ]
  },
  {
    "name": "澳门游玩",
    "children": [
      "1080.1443 夜晚澳门巴黎铁塔.jpg",
      "1443.1080 微信图片_20210108213615.jpg",
      "1443.1080 微信图片_20210108213635.jpg",
      "1443.1080 微信图片_20210108213645.jpg",
      "1443.1080 微信图片_20210108213707.jpg",
      "1080.1443 白天澳门巴黎铁塔.jpg"
    ]
  }
]
```

将`photos.json`拷贝到博客目录下的`photos`

![image-20210110210639345](hexo%E7%9A%84fluid%E4%B8%BB%E9%A2%98%E6%B7%BB%E5%8A%A0%E7%80%91%E5%B8%83%E6%B5%81%E6%87%92%E5%8A%A0%E8%BD%BD%E7%9B%B8%E5%86%8C%E5%8A%9F%E8%83%BD/image-20210110210639345.png)

## 加载 js和css文件

在 `/source/js/` 目录下创建 `photoWall.js`：

```js
var imgDataPath = "/blog/photos/photos.json"; //图片名称高宽信息json文件路径
var imgPath = "https://cdn.jsdelivr.net/gh/Cenergy/images/gallery/"; //图片访问路径
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
    const {
      imageWidth,
      imageX,
      imageY,
      name,
      imgPath,
      imgName,
      imgNameWithPattern,
    } = options;
    const htmlEle = `<div class="card lozad" style="width:${imageWidth}px">
                  <div class="ImageInCard" style="height:${
                    (imageWidth * imageY) / imageX
                  }px">
                    <a data-fancybox="gallery" href="${imgPath}${name}/${imgNameWithPattern}"
                          data-caption="${imgName}" title="${imgName}">
                            <img  class="lazyload" data-src="${imgPath}${name}/${imgNameWithPattern}"
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
    if (!data.length) return;
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
      const activeClass = index === 0 ? "active" : "";
      liHtml += `<li class="nav-item" role="presentation">
          <a class="nav-link ${activeClass} photo-tab" id="home-tab" photo-uuid="${item.name}" data-toggle="tab" href="#${item.name}"  role="tab" aria-controls="${item.name}" aria-selected="true">${item.name}</a>
        </li>`;
    });
    const [initData = {}] = data;
    const { children = [],name } = initData;
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
        name,
        imgName,
        imgPath,
        imgNameWithPattern,
      };
      li += this.constructHtml(imgOptions);
    });
    contentHtml += ` <div class="tab-pane fade show active"  role="tabpanel" aria-labelledby="home-tab">${li}</div>`;

    const ulHtml = `<ul class="nav nav-tabs" id="myTab" role="tablist">${liHtml}</ul>`;
    const tabContent = `<div class="tab-content" id="myTabContent">${contentHtml}</div>`;

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
      const { children,name } = selectedData;
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
          name,
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

```

然后使用注册器将需要的`js`,`css`注入,在`scripts/injector.js`(如没有,则创建)中输入以下内容:

```js
const { root: siteRoot = "/" } = hexo.config;
// layout为photo的时候导入这些js与css
hexo.extend.injector.register(
  "body_end",
  `
  <link rel="stylesheet" href="https://cdn.staticfile.org/fancybox/3.5.7/jquery.fancybox.min.css">
  <script src="//cdn.jsdelivr.net/npm/minigrid@3.1.1/dist/minigrid.min.js"></script>
  <script src="https://cdn.staticfile.org/fancybox/3.5.7/jquery.fancybox.min.js"></script>
	<script src="https://cdn.bootcdn.net/ajax/libs/lazyloadjs/3.2.2/lazyload.js"></script>
    <script defer src="${siteRoot}js/photoWall.js"></script>`,
  "photo"
);
```

至此,已经能看到加载出图片了,但是假如不使用cdn或者其他懒加载策略的话会感觉很慢!!

>参考:https://blog.dlzhang.com/posts/31/