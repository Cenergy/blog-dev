---
title: hexo的fluid主题添加瀑布流懒加载相册功能
index_img: /posts/798ba833/images.jpg
abbrlink: 798ba833
date: 2021-01-10 16:57:10
tags: [hexo,fluid]
---
<div class="note note-warning">相册演示地址:<a style="color:red" href="https://www.aigisss.com/blog/photos/">https://www.aigisss.com/blog/photos/</a> ,当前演示环境基于hexo===5.2.0 , fluid===1.8.7,很大程度上参考了醉里挑灯赏猫的<a href="https://blog.dlzhang.com/posts/31/" style="color:red">Hexo NexT 博客增加瀑布流相册页面</a>这篇博客!在此感谢班班提供的帮助!!</div>

## 处理图片信息

在博客根目录的 `/scripts/` 文件夹下新建一个 `photohandle.js` 文件，内容如下。主要功能是使用`image-size`( `npm i -S image-size`安装)访问照片文件夹，获取每张照片的大小和文件名，并生成对应的 `json` 文件：

```JavaScript
"use strict";
const fs = require("fs");
const sizeOf = require('image-size'); 
//本地照片所在目录
const path = "source/photos/images"; 
//要放置生成的照片信息文件目录，建议直接放在 source/photos/ 文件夹下
const output = "source/photos/photoslist.json";
var dimensions;
fs.readdir(path, function (err, files) {
    if (err) {
        return;
    }
    let arr = [];
    (function iterator(index) {
        if (index == files.length) {
            fs.writeFileSync(output, JSON.stringify(arr, null, "\t"));
            return;
        }
        fs.stat(path + "/" + files[index], function (err, stats) {
            if (err) {
                return;
            }
            if (stats.isFile()) {
                dimensions = sizeOf(path + "/" + files[index]);
                console.log(dimensions.width, dimensions.height);
                arr.push(dimensions.width + '.' + dimensions.height + ' ' + files[index]);
            }
            iterator(index + 1);
        })
    }(0));
});
```

创建好并把照片放在目录后，执行以下命令：

```js
node scripts/photohandle.js
```

`node scripts/phototool.js` 这个步骤以后可以不用手动执行，每次 `hexo s` 或者 `hexo deploy` 时候会被自动执行。如果报错，请注意检查保存本地照片的文件夹里有没有非图片类文件，特别是要删除如 `.DS_Store` 这样的隐藏文件。`json` 文件样例如下：

```json
[
      "1080.1440 广州塔顶夜晚景色.jpg",
      "1080.1440 广州塔顶夜晚景色2.jpg",
      "1080.1440 晚上广州塔.jpg",
      "1080.1443 白天广州塔.jpg"
]
```

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

<div class="ImageGrid"></div>

```



## 加载 js和css文件

在 `/source/js/` 目录下创建 `photoWall.js`：

```js
var imgDataPath = "/blog/photos/photoslist.json"; //图片名称高宽信息json文件路径
var imgPath = "/blog/photos/images/"; //图片访问路径
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

photo = {
  page: 1,
  offset: imgMaxNum,
  init: function () {
    var that = this;
    $.getJSON(imgDataPath, function (data) {
      that.render(that.page, data);
      //that.scroll(data);
    });
  },
  render: function (page, data=[]) {
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
    for (var i = begin; i < end && i < data.length; i++) {
      imgNameWithPattern = data[i].split(" ")[1];
      imgName = imgNameWithPattern.split(".")[0];
      imageSize = data[i].split(" ")[0];
      imageX = imageSize.split(".")[0];
      imageY = imageSize.split(".")[1];
      li +=`<div class="card lozad" style="width:${imageWidth}px">
                <div class="ImageInCard" style="height:${(imageWidth * imageY) / imageX}px">
                  <a data-fancybox="gallery" href="${imgPath}${imgNameWithPattern}"
                    data-caption="${imgName}" title="${imgName}">
                         <img  class="lazyload" data-src="${imgPath}${imgNameWithPattern}"
                          src="${imgPath}${imgNameWithPattern}">
                          src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                          onload="lzld(this)"
                          lazyload="auto">
                  </a>
                </div>
            </div>`;
    }
    $(".ImageGrid").append(li);
    this.minigrid();
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