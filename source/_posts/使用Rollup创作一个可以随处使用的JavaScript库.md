---
title: 使用Rollup创作一个可以随处使用的JavaScript库
index_img: /posts/90da98cf/rollup-1626491194567.jpg
abbrlink: 90da98cf
date: 2021-07-17 10:59:25
tag: [Rollup]
---

## 前言

在本文中，我们的目标是创建和发布一个无需更改代码即可在客户端和服务器端应用程序中使用的库。

我们需要满足以下用例：

1. 该库是用 ES6+ 编写的，使用 import 和 export 关键字
2. 该库可以与 `<script> `标签一起使用
3. 该库可用于使用现代打包器的 Web 应用程序。
4. 该库可用于Node应用程序。

从技术上讲，这意味着库需要在以下上下文中工作：

使用`<script>`标签：

```html
<html>
  <head>
    <script src="scripts/my-library.min.js"></script>
  </head>
  <body>
    <div id="app" />
    <script>
      myLibrary.helloWorld();
    </script>
  </body>
</html>
```

使用 RequireJS：

```js
define(["my-library"], function (myLibrary) {});
// or
define(function (require) {
  var myLibrary = require("my-library");
});
```

在使用诸如 webpack 之类的打包器的 Web 应用程序中：

```js
import { helloWorld } from "my-library";
helloWorld();
```

在Node的应用程序中：

```js
const myLibrary = require("my-library");
myLibrary.helloWorld();
// or
const { helloWorld } = require("my-library");
helloWorld();
```

**注：**在Web应用程序中我们使用打包工具，没有办法导入整个库，并调用它(`import lib from 'library'; lib.sayHello();`)。我们希望调用他们使用时tree-shaking 就可以完成它的工作，并在打包最终应用程序时消除死代码。

为了实现这一切，我们将使用[rollup.js](https://rollupjs.org/)。主要原因是 Rollup 非常快（[虽然不是最快的](https://github.com/evanw/esbuild)），需要最少的配置，并通过其方便的插件系统支持我们需要的一切。

## 什么是`rollup`？

系统的了解`rollup`之前，我们先来简单了解下`What is rollup？`

关于`rollup`的介绍，官方文档已经写的很清楚了：

> Rollup 是一个 JavaScript 模块打包器，可以将小块代码编译成大块复杂的代码，例如 library 或应用程序。

**`Webpack`偏向于应用打包的定位不同，`rollup.js`更专注于`Javascript`类库打包。**

我们熟知的`Vue`、`React`等诸多知名框架或类库都是通过`rollup.js`进行打包。

## 为什么是`rollup`

`webpack`我相信做前端的同学大家都用过，那么为什么有些场景还要使用`rollup`呢？这里我简单对`webpack`和`rollup`做一个比较：

总体来说`webpack`和`rollup`在不同场景下，都能发挥自身优势作用。`webpack`对于代码分割和静态资源导入有着“先天优势”，并且支持热模块替换(`HMR`)，而`rollup`并不支持。

所以当开发应用时可以优先选择`webpack`，但是`rollup`对于代码的`Tree-shaking`和`ES6`模块有着算法优势上的支持，若你项目只需要打包出一个简单的`bundle`包，并是基于`ES6`模块开发的，可以考虑使用`rollup`。

其实`webpack`从`2.0`开始就已经支持`Tree-shaking`，并在使用`babel-loader`的情况下还可以支持`es6 module`的打包。实际上，`rollup`已经在渐渐地失去了当初的优势了。但是它并没有被抛弃，反而因其简单的`API`、使用方式被许多库开发者青睐，如`React`、`Vue`等，都是使用`rollup`作为构建工具的。

## 使用rollup

编写完我们的库后，我们将使用 Rollup 将代码导出为以下三种格式：

1. UMD（通用模块定义）：这将支持使用脚本标签和 RequireJS。由于使用应用程序不会自己转译或打包代码，我们需要提供一个版本的库，该版本经过缩小和转译以获得广泛的浏览器支持。
2. ESM（ES2015 模块）：这将允许打包器导入我们的应用程序，消除死代码并将其转换为他们选择的级别。我们仍编译代码，但只是以方便调用者的格式，让他们决定下一步做什么。这将允许`import`关键字工作。
3. CJS (CommonJS)：[Node.js](https://nodejs.org/)的首选格式。这里不需要`Tree-shaking`，因为代码大小无关紧要，这种格式允许`require`在节点应用程序中使用关键字。

对于这些格式中的每一种，我们还将提供一个源映射，以便调用时可以在需要时调试库。

第一步是创建一个项目：

```sh
$ mkdir my-library 
$ cd my-library 
$ npm init -y
```

接下来我们需要添加一些依赖项。

显然，我们需要汇总。

```sh
$ npm install rollup --save-dev
```

我们知道我们需要转译 UMD 格式的代码，所以让我们安装 babel：

```sh
$ npm install @babel/core @babel/preset-env --save-dev
```

我们还需要 rollup 来使用 babel 并缩小代码，所以让我们安装必要的插件来使用 babel 和[terser](https://terser.org/)：

```sh
$ npm install @rollup/plugin-babel rollup-plugin-terser --save-dev
```

最后，我们希望能够以[node](https://nodejs.org/api/modules.html#modules_all_together)的风格在我们的库中使用导入/导出语法：这允许使用 write`import fn from './fn'`而不是`import fn from './fn/index.js'`并且当然可以使用 node_modules 目录中的模块（我们在这里没有这样做）。

```sh
$ npm install @rollup/plugin-node-resolve --save-dev
```

我们库的最终依赖列表应该是这样的：

```json
"dependencies": {}, 
"devDependencies": { 
  "@babel/core": "^7.11.6", 
  "@babel/preset-env": "^7.11.5", 
  "@rollup/plugin-babel" : "^5.2.1", 
  "@rollup/plugin-node-resolve": "^9.0.0", 
  "rollup": "^2.28.2", 
  "rollup-plugin-terser": "^7.0.2 " 
},
```

我们还需要一个存放源代码的目录、一个 babel 的配置文件和一个 rollup 的配置文件：

```json
$ mkdir src 
$ touch .babelrc.json // 或者新建.babelrc文件，二者选其一
$ touch rollup.config.js
```

babel 的配置将非常简单，我们只需要告诉 babel 我们要使用最新版本的 JavaScript：

```json
{
  "presets": [["@babel/env", { "modules": false }]]
}
```

对于 Rollup，我们需要导入必要的插件：

```js
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import babel from "@rollup/plugin-babel";
```

我们还将导入 package.json，因此我们可以`name`在导出 UMD 包时使用该字段：

```
import pkg from "./package.json";
```

我们`rollup.config.js`要做两件事：

对于 UMD：获取代码，处理它并通过 babel（transpile）和 terser（minify）运行它，并将其导出为 UMD 可消耗文件。

```js
{
  // UMD
  input: "src/index.js",
  plugins: [
    nodeResolve(),
    babel({
      babelHelpers: "bundled",
    }),
    terser(),
  ],
  output: {
    file: `dist/${pkg.name}.min.js`,
    format: "umd",
    name: "myLibrary",
    esModule: false,
    exports: "named",
    sourcemap: true,
  },
},
```

对于 CJS/ESM：获取代码，对其进行处理，然后将其导出为 ESM 模块和 CJS 模块。请记住，在这种情况下，我们不需要转译或缩小。Node 不需要它，而对于 ESM，调用者会这样做。

```js
{
  input: ["src/index.js"],
  plugins: [nodeResolve()],
  output: [
    {
      dir: "dist/esm",
      format: "esm",
      exports: "named",
      sourcemap: true,
    },
    {
      dir: "dist/cjs",
      format: "cjs",
      exports: "named",
      sourcemap: true,
    },
  ],
},
```

然而，在所有情况下，我们都会生成一个源映射。

注意`exports: "named"`所有配置中的选项，[在 rollup 的文档中有更好的解释](https://rollupjs.org/guide/en/#outputexports)，基本上这告诉 rollup 我们使用命名导出而不是默认导出。长话短说，这允许尽可能广泛的兼容性，并使`Tree-shaking`发生。如果您使用 linter，请确保将其配置为支持命名导出而不是默认导出（这不适用于应用程序，仅适用于库，使用默认导出甚至混合应用程序的默认/命名导出完全没问题）。

完整的汇总文件如下所示。由于名称取自 package.json，您实际上几乎可以按原样使用此文件，只要入口点是，`src/index.js`并且`name`在 UMD 模块的输出中进行了相应设置。

```js
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import babel from "@rollup/plugin-babel";
import pkg from "./package.json";
const input = ["src/index.js"];
export default [
  {
    // UMD
    input,
    plugins: [
      nodeResolve(),
      babel({
        babelHelpers: "bundled",
      }),
      terser(),
    ],
    output: {
      file: `dist/${pkg.name}.min.js`,
      format: "umd",
      name: "myLibrary", // this is the name of the global object
      esModule: false,
      exports: "named",
      sourcemap: true,
    },
  },
// ESM and CJS
  {
    input,
    plugins: [nodeResolve()],
    output: [
      {
        dir: "dist/esm",
        format: "esm",
        exports: "named",
        sourcemap: true,
      },
      {
        dir: "dist/cjs",
        format: "cjs",
        exports: "named",
        sourcemap: true,
      },
    ],
  },
];
```

现在我们有了依赖项，配置了 babel 和 rollup，是时候编写代码了。

我们将像这样布局我们的文件：

```sh
src
├── goodbye
│   ├── goodbye.js
│   └── index.js
├── hello
│   ├── hello.js
│   └── index.js
└── index.js
```

代码将非常简单：

```js
// src/index.js
export { default as hello } from "./hello";
export { default as goodbye } from "./goodbye";
// src/hello/index.js
export { default } from "./hello";
// src/hello/hello.js
export default function hello() {
  console.log("hello");
}
// src/goodbye/index.js
export { default } from "./goodbye";
// src/goodbye/goodbye.js
export default function goodbye() {
  console.log("goodbye");
}
```

接下来我们需要调用 rollup 并告诉它完成它的工作。为方便起见，我们将创建两个 npm 脚本，一个用于构建库，一个开发任务将在每次更改时重新编译代码：

```json
“scripts”: {
 “build”: “rollup -c”,
 “dev”: “rollup -c -w”
},
```

最后，我们需要描述应用程序是如何导出的，既可以让 npmjs 使用，也可以让调用者使用。

我们将在 package.json 中定义三个值：

files 选项告诉 npm 要打包什么（这可以使用 npm pack 进行测试），指向 CJS 模块的主要选项，以及 module 选项，虽然不是标准的，但已成为 ESM 模块的规范。

```json
// package.json
...
"main": "dist/cjs/index.js",
"module": "dist/esm/index.js",
...
files: [
  "dist"
]
```

就是这样！

要构建库，只需运行`npm run build`，在开发过程中，您可以使用`npm run dev`. 可以使用导出来测试`npm pack`

## 测试

**使用 script 标签**，只需创建一个 HTML 文件，然后在浏览器中打开它。您将在控制台中看到“hello”这个词。

```html
<html>
<head>
    <script src="dist/my-library.min.js"></script>
  </head>
<body>
    <script>
      myLibrary.hello()
    </script>
  </body>
</html>
```

**使用 Requires.JS**，创建一个小的 webapp 并使用[serve 为其提供服务](https://www.npmjs.com/package/serve)：

```sh
www
├── index.html
└── scripts
    ├── app.js
    ├── my-library.min.js
    └── require.js
```

index.html

```html
<html>
<head>
    <script
      data-main="scripts/app.js"
      src="scripts/require.js"
    ></script>
  </head>
<body>
  </body>
</html>
```

app.js

```js
requirejs.config({
  baseUrl: "scripts"
});
requirejs(["my-library.min"], function (myLibrary) {
  myLibrary.hello();
});
```

“hello”这个词将打印在控制台中。模块发布后，`my-library.min.js`可从https://unpkg.com/获得该文件。

**从 node**，在 library 目录之外，创建一个 js 文件并通过指向 my-library 目录（不是 dist 文件夹！）来要求模块：

```js
const myLibrary = require("../my-library");
myLibrary.hello(); // hello
myLibrary.goodbye(); // goodbye
```

如果您更进一步并调试应用程序，源映射也将启动！

**从使用 webpack 的 Web 应用程序**，如 React 应用程序：

```sh
$ npx create-react-app my-library-cra 
$ cd my-library-cra
```

在 package.json 的依赖项部分，只需添加以下行：

```json
"my-library": "../my-library/"
```

并运行 `yarn install`

在src/App.js，进口和调用Hello功能**只需要**：

```
import {hello} from 'my-library';
hello();
```

使用`yarn start`并打开 JavaScript 控制台运行 React 应用程序，您应该会看到打印出“hello”字样。

现在要确保`tree-shaking`有效，请运行`yarn build`. React 应用程序将被打包并放入`build`目录中。如果你在文件中搜索`hello`关键字，你会看到它在一个很长的复杂名称的js文件中，但`goodbye`找不到关键字。这表明 webpack 只拉入了必要的代码。并且由于我们在我们的库中使用命名导出，我们库的使用者不能编写`import myLibrary from 'my-library';`和错误地导入整个包，而只使用其中的一小部分。

下面介绍`rollup`中的几种常用的插件以及`external`属性、`tree-shaking`机制。

## 补充说明

### `resolve`插件

#### 为什么要使用`resolve`插件

在上面的入门案例中，我们打包的对象是本地的`js`代码和库，但实际开发中，不太可能所有的库都位于本地，我们大多会通过`npm`下载远程的库。

与`webpack`和`browserify`这样的其他打包器包不同，`rollup`不知道如何打破常规去处理这些依赖。因此我们需要添加一些配置。

#### `resolve`插件使用

首先在我们的项目中添加一个依赖`the-answer`，然后修改`src/index.js`文件:

```js
import answer from "the-answer";

export default function () {
  console.log("the answer is " + answer);
}

```

执行`npm run build`。

> 这里为了方便，我将原本的`rollup -c -w`添加到了`package.json`的`scripts`中：`"build": "rollup -c -w"`

会得到以下报错： ![img](https:////p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f5730d429a8a4d61ab28a839f3343394~tplv-k3u1fbpfcp-zoom-1.image) 打包后的`bundle.js`仍然会在`Node.js`中工作，但是`the-answer`不包含在包中。为了解决这个问题，将我们编写的源码与依赖的第三方库进行合并，`rollup.js`为我们提供了`resolve`插件。

首先，安装`resolve`插件：

```js
npm i -D @rollup/plugin-node-resolve
```

修改配置文件`rollup.config.js`：

```js
import resolve from "@rollup/plugin-node-resolve";

export default {
  input: ["./src/index.js"],
  output: {
    file: "./dist/bundle.js",
    format: "umd",
    name: "experience",
  },
  plugins: [resolve()],
};

```

这时再次执行`npm run build`，可以发现报错已经没有了： ![img](https:////p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4712a288683f44f2a871b2c518b02ab5~tplv-k3u1fbpfcp-zoom-1.image)

打开`dist/bundle.js`文件：

```js
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.experience = factory());
}(this, (function () { 'use strict';

  var index = 42;

  function index$1 () {
    console.log("the answer is " + index);
  }

  return index$1;

})));

```

打包文件`bundle.js`中已经包含了引用的模块。

有些场景下，虽然我们使用了`resolve`插件，但可能我们仍然想要某些库保持外部引用状态，这时我们就需要使用`external`属性，来告诉`rollup.js`哪些是外部的类库。

### external 属性

修改`rollup.js`的配置文件：

```js
import resolve from "@rollup/plugin-node-resolve";

export default {
  input: ["./src/index.js"],
  output: {
    file: "./dist/bundle.js",
    format: "umd",
    name: "experience",
  },
  plugins: [resolve()],
  external: ["the-answer"],
};

```

重新打包，打开`dist/bundle.js`文件：

```js
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('the-answer')) :
  typeof define === 'function' && define.amd ? define(['the-answer'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.experience = factory(global.answer));
}(this, (function (answer) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var answer__default = /*#__PURE__*/_interopDefaultLegacy(answer);

  function index () {
    console.log("the answer is " + answer__default['default']);
  }

  return index;

})));

```

这时我们看到`the-answer`已经是做为外部库被引入了。

### `commonjs`插件

#### 为什么需要`commonjs`插件

`rollup.js`编译源码中的模块引用默认只支持 `ES6+`的模块方式`import/export`。然而大量的`npm`模块是基于`CommonJS`模块方式，这就导致了大量 `npm`模块不能直接编译使用。

因此使得`rollup.js`编译支持`npm`模块和`CommonJS`模块方式的插件就应运而生：`@rollup/plugin-commonjs`。

#### `commonjs`插件使用

首先，安装该模块：

```js
npm i -D @rollup/plugin-commonjs
```

然后修改`rollup.config.js`文件：

```
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
export default {
  input: ["./src/index.js"],
  output: {
    file: "./dist/bundle.js",
    format: "umd",
    name: "experience",
  },
  plugins: [resolve(), commonjs()],
  external: ["the-answer"],
};

```

### `babel`插件

#### 为什么需要`babel`插件？

我们在`src`目录下添加`es6.js`文件(⚠️ 这里我们使用了 es6 中的箭头函数)：

```js
const a = 1;
const b = 2;
console.log(a, b);
export default () => {
  return a + b;
};
```

然后修改`rollup.config.js`配置文件：

```js
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
export default {
  input: ["./src/es6.js"],
  output: {
    file: "./dist/esBundle.js",
    format: "umd",
    name: "experience",
  },
  plugins: [resolve(), commonjs()],
  external: ["the-answer"],
};
```

执行打包，可以看到`dist/esBundle.js`文件内容如下：

```js
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.experience = factory());
}(this, (function () { 'use strict';

  const a = 1;
  const b = 2;
  console.log(a, b);
  var es6 = () => {
    return a + b;
  };
  return es6;
})));
```

可以看到箭头函数被保留下来，这样的代码在不支持`ES6`的环境下将无法运行。我们期望在`rollup.js`打包的过程中就能使用`babel`完成代码转换，因此我们需要`babel`插件。

#### `babel`插件的使用

首先，安装：

```js
npm i -D @rollup/plugin-babel
```

同样修改配置文件`rollup.config.js`：

```js
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";

export default {
  input: ["./src/es6.js"],
  output: {
    file: "./dist/esBundle.js",
    format: "umd",
    name: "experience",
  },
  plugins: [resolve(), commonjs(), babel()],
  external: ["the-answer"],
};
```

然后打包，发现会出现报错： ![img](https:////p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c664d97500e84fba8a6c3e5e23b589fd~tplv-k3u1fbpfcp-zoom-1.image) 提示我们缺少`@babel/core`，因为`@babel/core`是`babel`的核心。我们来进行安装：

```js
npm i @babel/core
```

再次执行打包，发现这次没有报错了，但是我们尝试打开`dist/esBundle.js`：

```js
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.experience = factory());
}(this, (function () { 'use strict';

  const a = 1;
  const b = 2;
  console.log(a, b);
  var es6 = (() => {
    return a + b;
  });
  return es6;
})));
```

可以发现箭头函数仍然存在，显然这是不正确的，说明我们的`babel`插件没有起到作用。这是为什么呢？

原因是由于我们缺少`.babelrc`文件，添加该文件：

```js
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "modules": false,
        // "useBuiltIns": "usage"
      }
    ]
  ]
}
```

我们看`.babelrc`配置了`preset env`，所以先安装这个插件：

```js
npm i @babel/preset-env
```

这次再次执行打包，我们打开`dist/esBundle.js`文件：

```js
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.experience = factory());
}(this, (function () { 'use strict';
  var a = 1;
  var b = 2;
  console.log(a, b);
  var es6 = (function () {
    return a + b;
  });
  return es6;
})));
```

可以看到箭头函数被转换为了`function`，说明`babel`插件正常工作。

### `json`插件

#### 为什么要使用`json`插件？

在`src`目录下创建`json.js`文件：

```js
import json from "../package.json";
console.log(json.author);
```

内容很简单，就是引入`package.json`，然后去打印`author`字段。

修改`rollup.config.js`配置文件：

```js
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";

export default {
  input: ["./src/json.js"],
  output: {
    file: "./dist/jsonBundle.js",
    format: "umd",
    name: "experience",
  },
  plugins: [resolve(), commonjs(), babel()],
  external: ["the-answer"],
};
```

执行打包，发现会发生如下报错： 

![img](https:////p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/20c6782fd3d34c3b93c1178fbfa69338~tplv-k3u1fbpfcp-zoom-1.image) 提示我们缺少`@rollup/plugin-json`插件来支持`json`文件。

#### `json`插件的使用

来安装该插件：

```js
npm i -D @rollup/plugin-json
```

同样修改下配置文件，将插件加入`plugins`数组即可。

然后再次打包，发现打包成功了，我们打开生成的`dist/jsonBundle`目录：

```js
(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}((function () { 'use strict';

  var name = "rollup-experience";
  var version = "1.0.0";
  var description = "";
  var main = "index.js";
  var directories = {
  	example: "example"
  };
  var scripts = {
  	build: "rollup -c -w",
  	test: "echo \"Error: no test specified\" && exit 1"
  };
  var author = "Cosen";
  var license = "ISC";
  var dependencies = {
  	"@babel/core": "^7.11.6",
  	"@babel/preset-env": "^7.11.5",
  	"the-answer": "^1.0.0"
  };
  var devDependencies = {
  	"@rollup/plugin-babel": "^5.2.0",
  	"@rollup/plugin-commonjs": "^15.0.0",
  	"@rollup/plugin-json": "^4.1.0",
  	"@rollup/plugin-node-resolve": "^9.0.0"
  };
  var json = {
  	name: name,
  	version: version,
  	description: description,
  	main: main,
  	directories: directories,
  	scripts: scripts,
  	author: author,
  	license: license,
  	dependencies: dependencies,
  	devDependencies: devDependencies
  };
  console.log(json.author);
})));
```

完美！！

### `tree-shaking`机制

这里我们以最开始的`src/index.js`为例进行说明：

```js
import answer from "the-answer";

export default function () {
  console.log("the answer is " + answer);
}
```

修改上述文件：

```js
const a = 1;
const b = 2;
export default function () {
  console.log(a + b);
}
```

执行打包。打开`dist/bundle.js`文件：

```js
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.experience = factory());
}(this, (function () { 'use strict';

  var a = 1;
  var b = 2;
  function index () {
    console.log(a + b);
  }
  return index;
})));
```

再次修改`src/index.js`文件：

```js
const a = 1;
const b = 2;
export default function () {
  console.log(a);
}
```

再次执行打包，打开打包文件：

```js
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.experience = factory());
}(this, (function () { 'use strict';

  var a = 1;
  function index () {
    console.log(a);
  }
  return index;
})));
```

发现了什么？

我们发现关于变量`b`的定义没有了，因为源码中并没有用到这个变量。这就是`ES`模块著名的`tree-shaking`机制，它动态地清除没有被使用过的代码，使得代码更加精简，从而可以使得我们的类库获得更快的加载速度。

希望这会有所帮助，如果您有任何疑问，请在评论中告诉我！

>   https://www.jianshu.com/p/6a7413481bd2
>
>   https://juejin.cn/post/6869551115420041229#heading-1
