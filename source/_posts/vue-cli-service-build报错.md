---
title: vue-cli-service-build报错
abbrlink: 26a3b371
date: 2020-01-15 23:36:31
tags:
---

`vue-cli-service-build报错No module factory available for dependency type: CssDependency`

https://forum.vuejs.org/t/vue-cli-service-build/83951

在`vue.config.js`文件中配置

```js
module.exports = {
  css: {
    extract: false
  }
};
```

原因看下面
https://cli.vuejs.org/config/#css-extract
https://segmentfault.com/a/1190000016390112
