const { root: siteRoot = "/" } = hexo.config;

// layout为glsl的时候导入这些js与css
hexo.extend.injector.register(
  "body_end",
  `<link defer rel="stylesheet" href="${siteRoot}styles/glslEditor.css" />
  <script defer src="${siteRoot}js/glslCanvas.js"></script>
  <script defer src="${siteRoot}js/glslEditor.js"></script>
  <script defer src="${siteRoot}js/glslPost.js"></script>`,
  "glsl"
);
// layout为links的时候导入这些js与css
const linkHtmlElement = `<div class="container card">
                        <strong>本站简介:</strong>
                        <div class="link-title">名称：爱即是诗</div>
                        <div class="link-title">简介：AI&GIS博客</div>
                        <div class="link-title">链接：https://www.aigisss.com</div>
                        <div class="link-title">头像：https://www.aigisss.com/blog/img/avatar.png</div>
                        </div>`;
hexo.extend.injector.register("body_begin", linkHtmlElement, "linksss");
// layout为photo的时候导入这些js与css
hexo.extend.injector.register(
  "body_end",
  `
  <link rel="stylesheet" href="https://cdn.staticfile.org/fancybox/3.5.7/jquery.fancybox.min.css">
  <script src="//cdn.jsdelivr.net/npm/minigrid@3.1.1/dist/minigrid.min.js"></script>
  <script src="https://cdn.bootcdn.net/ajax/libs/lazyloadjs/3.2.2/lazyload.js"></script>
  <script src="https://cdn.staticfile.org/fancybox/3.5.7/jquery.fancybox.min.js"></script>
  <script defer src="${siteRoot}js/photoWall.js"></script>`,
  "photo"
);
// layout为talk的时候导入这些js与css
hexo.extend.injector.register(
  "body_end",
  `<link defer rel="stylesheet" href="${siteRoot}styles/artitalk.css" />
  <script type="text/javascript" src="https://unpkg.com/artitalk"></script>
  <script defer src="${siteRoot}js/talkShow.js"></script>`,
  "talk"
);
// 导入这些js与css
hexo.extend.injector.register(
  "body_end",
  `<script src='//cdn.jsdelivr.net/npm/@waline/client/dist/Waline.min.js'></script>
  <script src="${siteRoot}js/comment.js"></script>
  <script defer src="${siteRoot}js/comment2.js"></script>
  `,
);
// 导入这些js与css
hexo.extend.injector.register(
  "body_end",
  `<script src="${siteRoot}js/clicklove.js"></script>
  `,
);
