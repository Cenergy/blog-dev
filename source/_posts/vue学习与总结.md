---
title: vue学习与总结
tags: Vue
abbrlink: 3d0c447
date: 2019-09-16 09:29:36
categories:
  - 编程
  - 更新中
---

## 插值表达式

- v-cloak
- v-text
- v-html

> 使用 v-cloak 能够解决 插值表达式闪烁的问题，`[v-cloak] {display: none;}`。默认 v-text 是没有闪烁问题的，v-text 会覆盖元素中原本的内容，但是插值表达式 只会替换自己的这个占位符，不会把整个元素的内容清空

- v-bind(缩写:)

- v-on(缩写@)

- v-model 只能用于表单元素

- v-for

- v-if

- v-show

  > 一般来说，v-if 有更高的切换消耗而 v-show 有更高的初始渲染消耗。因此，如果需要频繁切换，v-show 较好，如果运行时条件不太可能改变 v-if 较好

## 事件修饰符

<!--more-->

- .stop 阻止冒泡
- .prevent 阻止默认事件
- .capture 添加事件侦听器时使用事件捕获模式
- .self 只当事件在该元素本身（比如不是子元素）触发时触发回调
- .once 事件只触发一次

## 在 Vue 中使用样式

### 使用 class 样式

1. 数组

```
<h1 :class="['red', 'thin']">这是一个邪恶的H1</h1>
```

2. 数组中使用三元表达式

```
<h1 :class="['red', 'thin', isactive?'active':'']">这是一个邪恶的H1</h1>
```

3. 数组中嵌套对象

```
<h1 :class="['red', 'thin', {'active': isactive}]">这是一个邪恶的H1</h1>
```

4. 直接使用对象

```
<h1 :class="{red:true, italic:true, active:true, thin:true}">这是一个邪恶的H1</h1>
```

### 使用内联样式

1. 直接在元素上通过 `:style` 的形式，书写样式对象

```
<h1 :style="{color: 'red', 'font-size': '40px'}">这是一个善良的H1</h1>
```

2. 将样式对象，定义到 `data` 中，并直接引用到 `:style` 中

- 在 data 上定义样式：

```
data: {
        h1StyleObj: { color: 'red', 'font-size': '40px', 'font-weight': '200' }
}
```

- 在元素中，通过属性绑定的形式，将样式对象应用到元素中：

```
<h1 :style="h1StyleObj">这是一个善良的H1</h1>
```

3. 在 `:style` 中通过数组，引用多个 `data` 上的样式对象

- 在 data 上定义样式：

```
data: {
        h1StyleObj: { color: 'red', 'font-size': '40px', 'font-weight': '200' },
        h1StyleObj2: { fontStyle: 'italic' }
}
```

- 在元素中，通过属性绑定的形式，将样式对象应用到元素中：

```
<h1 :style="[h1StyleObj, h1StyleObj2]">这是一个善良的H1</h1>
```

## Vue 指令之`v-if`和`v-show`

> 一般来说，v-if 有更高的切换消耗而 v-show 有更高的初始渲染消耗。因此，如果需要频繁切换 v-show 较好，如果在运行时条件不大可能改变 v-if 较好。

## 过滤器

概念：Vue.js 允许你自定义过滤器，**可被用作一些常见的文本格式化**。过滤器可以用在两个地方：**mustache 插值和 v-bind 表达式**。过滤器应该被添加在 JavaScript 表达式的尾部，由“管道”符指示；

### 私有过滤器

1. HTML 元素：

```
<td>{{item.ctime | dataFormat('yyyy-mm-dd')}}</td>

```

2. 私有 `filters` 定义方式：

```
filters: { // 私有局部过滤器，只能在 当前 VM 对象所控制的 View 区域进行使用

    dataFormat(input, pattern = "") { // 在参数列表中 通过 pattern="" 来指定形参默认值，防止报错

      var dt = new Date(input);

      // 获取年月日

      var y = dt.getFullYear();

      var m = (dt.getMonth() + 1).toString().padStart(2, '0');

      var d = dt.getDate().toString().padStart(2, '0');



      // 如果 传递进来的字符串类型，转为小写之后，等于 yyyy-mm-dd，那么就返回 年-月-日

      // 否则，就返回  年-月-日 时：分：秒

      if (pattern.toLowerCase() === 'yyyy-mm-dd') {

        return `${y}-${m}-${d}`;

      } else {

        // 获取时分秒

        var hh = dt.getHours().toString().padStart(2, '0');

        var mm = dt.getMinutes().toString().padStart(2, '0');

        var ss = dt.getSeconds().toString().padStart(2, '0');



        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;

      }

    }

  }

```

> 使用 ES6 中的字符串新方法 String.prototype.padStart(maxLength, fillString='') 或 String.prototype.padEnd(maxLength, fillString='')来填充字符串；

### 全局过滤器

```
// 定义一个全局过滤器

Vue.filter('dataFormat', function (input, pattern = '') {

  var dt = new Date(input);

  // 获取年月日

  var y = dt.getFullYear();

  var m = (dt.getMonth() + 1).toString().padStart(2, '0');

  var d = dt.getDate().toString().padStart(2, '0');



  // 如果 传递进来的字符串类型，转为小写之后，等于 yyyy-mm-dd，那么就返回 年-月-日

  // 否则，就返回  年-月-日 时：分：秒

  if (pattern.toLowerCase() === 'yyyy-mm-dd') {

    return `${y}-${m}-${d}`;

  } else {

    // 获取时分秒

    var hh = dt.getHours().toString().padStart(2, '0');

    var mm = dt.getMinutes().toString().padStart(2, '0');

    var ss = dt.getSeconds().toString().padStart(2, '0');



    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;

  }

});

```

> 注意：当有局部和全局两个名称相同的过滤器时候，会以就近原则进行调用，即：局部过滤器优先于全局过滤器被调用！

## 键盘修饰符以及自定义键盘修饰符

1. 通过`Vue.config.keyCodes.名称 = 按键值`来自定义案件修饰符的别名：

```js
Vue.config.keyCodes.f2 = 113;
```

2. 使用自定义的按键修饰符：

```
<input type="text" v-model="name" @keyup.f2="add">
```

## 自定义指令

- 使用 Vue.directive()定义全局的指令，比如 v-focus

- 其中 参数 1：指令的名称，定义时不需要加 v-的前缀

- 使用的时候必须在指令名称前面加上 v-前缀来调用

- 参数 2：是一个对象，这个对象上有一些指令相关的函数，这些函数可以在特定的阶段执行相关的操作

  ```javascript
  Vue.dirctive('focus',{
  bind:function(el){
  	//每当指令绑定到元素上的时候会立即执行这个bind函数，只执行一次
      //每个函数中的第一个参数永远是el表示被绑定的指令的那个元素，是原生的js对象
      //每当指令绑定到元素上的时候会立即执行这个bind函数，只执行一次
      // 和样式相关的操作，一般都可以在bind执行
  },
      inserted(el){
          el.focus();
        // 和js行为相关的操作，最好在inserted中执行，防止js行为不生效
      },
      updated(el){
         //当Vnode更新时，会执行updated，可能会触发多次
      }
  }
  ```

- 私有指令的定义

  ```js
   dirctives:{
        //自定义指令的简写形式，等同于定义了 bind 和 update 两个钩子函数
    	'fontsize':function (el,binding){
            el.style.fontSize=binding.value
        }
    }
  ```

  2. 自定义指令的使用方式：

  ```
  <input type="text" v-model="searchName" v-focus v-color="'red'" v-font-weight="900">
  ```

### 实现筛选的方式显示过滤-排序结果：

- 筛选框绑定到 VM 实例中的 `searchName` 属性：

```
<hr> 输入筛选名称：

<input type="text" v-model="searchName">

```

- 在使用 `v-for` 指令循环每一行数据的时候，不再直接 `item in list`，而是 `in` 一个 过滤的 methods 方法，同时，把过滤条件`searchName`传递进去：

```
<tbody>

      <tr v-for="item in search(searchName)">

        <td>{{item.id}}</td>

        <td>{{item.name}}</td>

        <td>{{item.ctime}}</td>

        <td>

          <a href="#" @click.prevent="del(item.id)">删除</a>

        </td>

      </tr>

    </tbody>

```

- `search` 过滤方法中，使用 数组的 `filter` 方法进行过滤：

```
search(name) {

  return this.list.filter(x => {

    return x.name.indexOf(name) != -1;

  });

}

```

## JSONP 的实现原理

- 由于浏览器安全限制，不允许 AXAJ 访问协议不同、域名不同、端口号不同——不符合同源策略的。
- 可以通过动态创建 script 标签的形式，把 script 标签的 src 属性指向数据接口的地址。因为 script 标签不存在跨域限制，这种数据获取方式称之为 JSONP
- 具体实现过程

  - 先在客户端定义一个回调方法，预定义对数据的操作；

  - 再把这个回调方法的名称通过 URL 传参的形式提交到服务器的数据接口；

  - 服务器数据接口组织好要发送给客户端的数据，再拿客户端传递过来的回调方法名称拼接出一个调用这个方法的字符串，发送给客户端解析执行；

  - 客户端拿到服务器的返回的字符串之后，当作 script 脚本执行。

  - Node.js 实现一个 JSONP 的请求例子

    ```
    const http = require('http');
        // 导入解析 URL 地址的核心模块
        const urlModule = require('url');

        const server = http.createServer();
        // 监听 服务器的 request 请求事件，处理每个请求
        server.on('request', (req, res) => {
          const url = req.url;

          // 解析客户端请求的URL地址
          var info = urlModule.parse(url, true);

          // 如果请求的 URL 地址是 /getjsonp ，则表示要获取JSONP类型的数据
          if (info.pathname === '/getjsonp') {
            // 获取客户端指定的回调函数的名称
            var cbName = info.query.callback;
            // 手动拼接要返回给客户端的数据对象
            var data = {
              name: 'zs',
              age: 22,
              gender: '男',
              hobby: ['吃饭', '睡觉', '运动']
            }
            // 拼接出一个方法的调用，在调用这个方法的时候，把要发送给客户端的数据，序列化为字符串，作为参数传递给这个调用的方法：
            var result = `${cbName}(${JSON.stringify(data)})`;
            // 将拼接好的方法的调用，返回给客户端去解析执行
            res.end(result);
          } else {
            res.end('404');
          }
        });

        server.listen(3000, () => {
          console.log('server running at =http://127.0.0.1:3000');
        });
    ```

## [Vue 中的动画](https://cn.vuejs.org/v2/guide/transitions.html)

### 使用过渡类名

1. HTML 结构：

```
<div id="app">
    <input type="button" value="动起来" @click="myAnimate">
    <!-- 使用 transition 将需要过渡的元素包裹起来 -->
    <transition name="fade">
      <div v-show="isshow">动画哦</div>
    </transition>
  </div>
```

2. VM 实例：

```
// 创建 Vue 实例，得到 ViewModel
var vm = new Vue({
  el: '#app',
  data: {
    isshow: false
  },
  methods: {
    myAnimate() {
      this.isshow = !this.isshow;
    }
  }
});

```

3. 定义两组类样式：

```
/* 定义进入和离开时候的过渡状态 */
    .fade-enter-active,
    .fade-leave-active {
      transition: all 0.2s ease;
      position: absolute;
    }

    /* 定义进入过渡的开始状态 和 离开过渡的结束状态 */
    .fade-enter,
    .fade-leave-to {
      opacity: 0;
      transform: translateX(100px);
    }
```

### [使用第三方 CSS 动画库](https://cn.vuejs.org/v2/guide/transitions.html#自定义过渡类名)

1. 导入动画类库：

```
<link rel="stylesheet" type="text/css" href="./lib/animate.css">
```

2. 定义 transition 及属性：

```
<transition
	enter-active-class="fadeInRight"
    leave-active-class="fadeOutRight"
    :duration="{ enter: 500, leave: 800 }">
  	<div class="animated" v-show="isshow">动画哦</div>
</transition>
```

### 使用动画钩子函数

1. 定义 transition 组件以及三个钩子函数：

```
<div id="app">
    <input type="button" value="切换动画" @click="isshow = !isshow">
    <transition
    @before-enter="beforeEnter"
    @enter="enter"
    @after-enter="afterEnter">
      <div v-if="isshow" class="show">OK</div>
    </transition>
  </div>
```

2. 定义三个 methods 钩子方法：

```
methods: {
        beforeEnter(el) { // 动画进入之前的回调
          el.style.transform = 'translateX(500px)';
        },
        enter(el, done) { // 动画进入完成时候的回调
          el.offsetWidth;
          el.style.transform = 'translateX(0px)';
          done();
        },
        afterEnter(el) { // 动画进入完成之后的回调
          this.isshow = !this.isshow;
        }
      }
```

3. 定义动画过渡时长和样式：

```
.show{
      transition: all 0.4s ease;
    }
```

### [v-for 的列表过渡](https://cn.vuejs.org/v2/guide/transitions.html#列表的进入和离开过渡)

1. 定义过渡样式：

```
<style>
    .list-enter,
    .list-leave-to {
      opacity: 0;
      transform: translateY(10px);
    }

    .list-enter-active,
    .list-leave-active {
      transition: all 0.3s ease;
    }
</style>
```

2. 定义 DOM 结构，其中，需要使用 transition-group 组件把 v-for 循环的列表包裹起来：

```
  <div id="app">
    <input type="text" v-model="txt" @keyup.enter="add">

    <transition-group tag="ul" name="list">
      <li v-for="(item, i) in list" :key="i">{{item}}</li>
    </transition-group>
  </div>
```

3. 定义 VM 中的结构：

```
    // 创建 Vue 实例，得到 ViewModel
    var vm = new Vue({
      el: '#app',
      data: {
        txt: '',
        list: [1, 2, 3, 4]
      },
      methods: {
        add() {
          this.list.push(this.txt);
          this.txt = '';
        }
      }
    });
```

### 列表的排序过渡

`<transition-group>` 组件还有一个特殊之处。不仅可以进入和离开动画，**还可以改变定位**。要使用这个新功能只需了解新增的 `v-move` 特性，**它会在元素的改变定位的过程中应用**。

- `v-move` 和 `v-leave-active` 结合使用，能够让列表的过渡更加平缓柔和：

```
.v-move{
  transition: all 0.8s ease;
}
.v-leave-active{
  position: absolute;
}
```

## 定义 Vue 组件

什么是组件： 组件的出现，就是为了拆分 Vue 实例的代码量的，能够让我们以不同的组件，来划分不同的功能模块，将来我们需要什么样的功能，就可以去调用对应的组件即可；
组件化和模块化的不同：

- 模块化： 是从代码逻辑的角度进行划分的；方便代码分层开发，保证每个功能模块的职能单一；
- 组件化： 是从 UI 界面的角度进行划分的；前端的组件化，方便 UI 组件的重用；

### 全局组件定义的三种方式

1. 使用 Vue.extend 配合 Vue.component 方法：

```
var login = Vue.extend({
      template: '<h1>登录</h1>'
    });
    Vue.component('login', login);
```

2. 直接使用 Vue.component 方法：

```
Vue.component('register', {
      template: '<h1>注册</h1>'
    });
```

3. 将模板字符串，定义到 script 标签种：

```
<script id="tmpl" type="x-template">
      <div><a href="#">登录</a> | <a href="#">注册</a></div>
    </script>
```

同时，需要使用 Vue.component 来定义组件：

```
Vue.component('account', {
      template: '#tmpl'
    });
```

> 注意： 组件中的 DOM 结构，有且只能有唯一的根元素（Root Element）来进行包裹！

### 组件中展示数据和响应事件

1. 在组件中，`data`需要被定义为一个方法，例如：

```
Vue.component('account', {
      template: '#tmpl',
      data() {
        return {
          msg: '大家好！'
        }
      },
      methods:{
        login(){
          alert('点击了登录按钮');
        }
      }
    });
```

2. 在子组件中，如果将模板字符串，定义到了 script 标签中，那么，要访问子组件身上的`data`属性中的值，需要使用`this`来访问；

- 组件可以有自己的 data 数据
- 组件的 data 和 实例的 data 有点不一样,实例中的 data 可以为一个对象,但是 组件中的 data 必须是一个方法
- 组件中的 data 除了必须为一个方法之外,这个方法内部,还必须返回一个对象才行;
- 组件中 的 data 数据,使用方式,和实例中的 data 使用方式完全一样!!!

## 组件切换

vue 提供了 component，来展示对应的名称组件
component 是一个占位符, :is 属性,可以用来指定要展示的组件的名称

```html
<div id="app">
  <a href="" @click.prevent="componentId='login'">登录</a>
  <a href="" @click.prevent="componentId='register'">注册</a>
  <component :is="componentId"></component>
</div>
```

当前学习了几个 Vue 提供的标签：

> component, template, transition, transitionGroup

## 父组件向子组件传值

1. 组件实例定义方式，注意：一定要使用`props`属性来定义父组件传递过来的数据

```
<script>
    // 创建 Vue 实例，得到 ViewModel
    var vm = new Vue({
      el: '#app',
      data: {
        msg: '这是父组件中的消息'
      },
      components: {
        son: {
          template: '<h1>这是子组件 --- {{finfo}}</h1>',
          props: ['finfo']
        }
      }
    });
  </script>
```

2. 使用`v-bind`或简化指令，将数据传递到子组件中：

```
<div id="app">
    <son :finfo="msg"></son>
  </div>
```

## 子组件向父组件传值

1. 原理：父组件将方法的引用，传递到子组件内部，子组件在内部调用父组件传递过来的方法，同时把要发送给父组件的数据，在调用方法的时候当作参数传递进去；
2. 父组件将方法的引用传递给子组件，其中，`getMsg`是父组件中`methods`中定义的方法名称，`func`是子组件调用传递过来方法时候的方法名称

```
<son @func="getMsg"></son>
```

3. 子组件内部通过`this.$emit('方法名', 要传递的数据)`方式，来调用父组件中的方法，同时把数据传递给父组件使用

```js
<div id="app">
    <!-- 引用父组件 -->
    <son @func="getMsg"></son>

    <!-- 组件模板定义 -->
    <script type="x-template" id="son">
      <div>
        <input type="button" value="向父组件传值" @click="sendMsg" />
      </div>
    </script>
  </div>

  <script>
    // 子组件的定义方式
    Vue.component('son', {
      template: '#son', // 组件模板Id
      methods: {
        sendMsg() { // 按钮的点击事件
          this.$emit('func', 'OK'); // 调用父组件传递过来的方法，同时把数据传递出去
        }
      }
    });

    // 创建 Vue 实例，得到 ViewModel
    var vm = new Vue({
      el: '#app',
      data: {},
      methods: {
        getMsg(val){ // 子组件中，通过 this.$emit() 实际调用的方法，在此进行定义
          alert(val);
        }
      }
    });
  </script>
```

## vue-router

```js
const router = new VueRouter({
  routes: [
    {
      path: "/",
      redirect: "/home",
      meta: {
        title: "首页"
      }
    },
  ],
  mode: "history",
  linkActiveClass: "active"
});

// 前置守卫
router.beforeEach((to, from, next) => {
  // 从from到to
  document.title = to.matched[0].meta.title || "vuebox";
  next();
});
// 后置钩子
router.afterEach((to, from) => {
  console.log("----------");
});
```

### keep-alive

activated和deactivated只有该组件使用了keep-alive时才是有效的。

组件内路由，`beforeRouteLeave(to,from,next){}`

`include` 和`exclude`

## 插槽slot

`vue2.x`

```html
<div slot="item-icon">
	<span>前置图标</span>
</div>
```

`vue3.x`

```html
<template v-slot:pre-icon>
	<span>
        前置图标
	</span>
</template>
```



```js
this.$router.push('/home/'+123)   
this.$router.push({path:'/home',query:{id:123}})
```

