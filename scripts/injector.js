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
  `<script defer src="${siteRoot}js/photoWall.js"></script>`,
  "photo"
);
