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
// layout为photo的时候导入这些js与css
hexo.extend.injector.register(
  "body_end",
  `
  <link rel="stylesheet" href="https://cdn.staticfile.org/fancybox/3.5.7/jquery.fancybox.min.css">
  <script src="//cdn.jsdelivr.net/npm/minigrid@3.1.1/dist/minigrid.min.js"></script>
  <script src="https://cdn.staticfile.org/fancybox/3.5.7/jquery.fancybox.min.js"></script>
    <script defer src="${siteRoot}js/photoWall.js"></script>`,
  "photo"
);
