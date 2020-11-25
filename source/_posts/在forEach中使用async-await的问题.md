---
title: 在forEach中使用async/await的问题
index_img: 'https://www.aigisss.com/static/images/bg.jpg'
abbrlink: 1fdac927
categories: 未分类
date: 2020-10-13 21:20:44
tags: javascript
---

```javascript
var multi = num => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (num) {
        resolve(num * num);
      } else {
        reject(new Error('num not specified'));
      }
    }, 1000);
  })
}
async function test () {
  var nums = [1, 2, 3];
  nums.forEach(async x => {
    var res = await multi(x);
    console.log(res);
  })
}
test();
```

在test 函数执行后我期望的结果是代码是串行执行的,我会在**每等一秒钟**输出一个数 ...1 ...4 ...9,但是现在获得的结果是**等了一秒一起**输出结果 1 4 9

### 找到问题

为什么在for循环/ for...of 里面可以实现await/async的功能，但是在forEach里面就不可以呢？首先我们来看下MDN网站的Polyfill

```js
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function(callback, thisArg) {
    var T, k;
    if (this == null) {
      throw new TypeError(' this is null or not defined');
    }

    var O = Object(this);
    var len = O.length >>> 0;

    if (typeof callback !== "function") {
      throw new TypeError(callback + ' is not a function');
    }

    if (arguments.length > 1) {
      T = thisArg;
    }
    k = 0;

    while (k < len) {
      var kValue;
      if (k in O) {
        kValue = O[k];
        callback.call(T, kValue, k, O);
      }
      k++;
    }
  };
}
```

可以看到当我们在forEach里面写的callback函数会直接在while循环里面调用，简化下

```js
Array.prototype.forEach = function (callback) {
  // this represents our array
  for (let index = 0; index < this.length; index++) {
    // We call the callback for each entry
    callback(this[index], index, this)
  }
}
```

相当于在for循环中执行了异步函数

```js
async function test () {
  var nums = await getNumbers()
//   nums.forEach(async x => {
//     var res = await multi(x)
//     console.log(res)
//   })
  for(let index = 0; index < nums.length; index++) {
    (async x => {
      var res = await multi(x)
      console.log(res)
    })(nums[index])
  }
}
```

### 解决办法

用for...of 或者for循环代替 forEach

```js
async function test () {
  var nums = await getNumbers()
  for(let x of nums) {
    var res = await multi(x)
    console.log(res)
  }
}
```