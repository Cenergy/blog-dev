---
title: 基于hexo的fluid主题的魔改汇总
index_img: /posts/1563abd8/fluid.png
tags:
  - hexo
  - fluid
abbrlink: 1563abd8
date: 2021-04-24 22:16:5
---

## 前言

**所谓魔改，就是与主题不同，一旦主题已经被采用或者被实现，~~则会被划掉~~，而且魔改初心是使用无侵入式的方式修改——即不修改源码，而是使用注入器的方式。这样的话主题升级比较容易！**

## 背景固定

效果如[背景所示](https://aigisss.com/blog/posts/1563abd8.html)，这种效果贯穿着整个博客。具体做法如下：使用`注入器`(如果没有`injector.js`文件，则在`scripts`文件夹下新建`injector.js`)，在`injector.js`中写下这些代码。

```js
// 全屏背景的需要导入这些js
const { root: siteRoot = "/" } = hexo.config;
hexo.extend.injector.register("body_begin", `<div id="web_bg"></div>`);
hexo.extend.injector.register(
  "body_end",
  `<script src="${siteRoot}js/backgroundize.js"></script>
  <link defer rel="stylesheet" href="${siteRoot}styles/backgroundize.css" />
  `
);
```

在`js`文件夹中新建`backgroundize.js`文件，内容如下：

```js
const bannerContainer = $("#banner");
const viewBg = $("#web_bg");
const bannerMask = $("#banner .mask");
const bg = $(bannerContainer).css("background-image");
$(viewBg).css("background-image", bg);
$(bannerContainer).css("background-image", "url()");
const color = $(bannerMask).css("background-color");
$(bannerMask).css("background-color", `rgba(0,0,0,0)`);
$(viewBg).css("background-color", color);
```

在`styles`文件夹中新增`backgroundize.css`文件，内容如下：

```css
#web_bg {
  position: fixed;
  z-index: -999;
  width: 100%;
  height: 100%;
  background-attachment: local;
  background-position: center;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  background-size: cover;
  background-repeat: repeat;
}
```



## 总结

如有疑问、建议或者想知道本博客魔改的地方，欢迎在下面留言！