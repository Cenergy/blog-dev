---
title: JavaScript整理之从原型到原型链
index_img: /posts/ba2c7364/prototype.png
abbrlink: ba2c7364
date: 2021-09-05 11:07:08
tags: JavaScript
---

## 前言

先直接上一个原型链图以便讲解:

![JavaScript原型和原型链](JavaScript%E6%95%B4%E7%90%86%E4%B9%8B%E4%BB%8E%E5%8E%9F%E5%9E%8B%E5%88%B0%E5%8E%9F%E5%9E%8B%E9%93%BE/1865431362-c3d090d5d00755cf_fix732-1625456575241-16308127777682.png)

图中Parent是构造函数，p1是通过Parent实例化出来的一个对象。

想要弄清楚原型和原型链，这几个属性必须要搞清楚，`__proto__`、`prototype`、 `constructor`。JavaScript中一切皆对象，函数也是对象。函数中有个特殊的函数——构造函数，任何函数都可以作为构造函数，但是并不能将任意函数叫做构造函数，只有当一个函数通过new关键字调用的时候才可以成为构造函数。下面几点是理解原型和原型链的重要知识点：

- `__proto__`、 `constructor`属性是对象所独有的；
- `prototype`属性是函数独有的；
- 上面说过JavaScript中函数也是对象的一种，那么函数同样也有属性`__proto__`、 `constructor`；

## prototype属性

它是函数独有的属性，从图中可以看到它从一个函数指向另一个对象，代表这个对象是这个函数的原型对象，这个对象也是当前函数所创建的实例的原型对象。
`prototype`设计之初就是为了实现继承，让由特定函数创建的所有实例共享属性和方法，也可以说是让某一个构造函数实例化的所有对象可以找到公共的方法和属性。有了`prototype`我们不需要为每一个实例创建重复的属性方法，而是将属性方法创建在构造函数的原型对象上（prototype）。那些不需要共享的才创建在构造函数中。

![323548351-1642fae65598fc65](JavaScript%E6%95%B4%E7%90%86%E4%B9%8B%E4%BB%8E%E5%8E%9F%E5%9E%8B%E5%88%B0%E5%8E%9F%E5%9E%8B%E9%93%BE/323548351-1642fae65598fc65-16311798697453-16311798757894.png)
继续引用上面的代码，当我们想为通过Parent实例化的所有实例添加一个共享的属性时

```js
Parent.prototype.name = "prototype";
```

这就是原型属性，当然你也可以添加原型方法。

## `__proto__`属性

`__proto__`属性是对象（包括函数）就有的属性。从图中可以看到**`__proto__`属性**是从一个对象指向另一个对象，即**从一个对象指向该对象的原型对象**。显然它的含义就是告诉我们一个对象的原型对象是谁。
prototype篇章我们说到，`Parent.prototype`上添加的属性和方法叫做原型属性和原型方法，该构造函数的实例都可以访问调用。那这个构造函数的原型对象上的属性和方法，怎么能和构造函数的实例联系在一起呢，就是通过`__proto__`属性。每个对象都有`__proto__`属性，该属性指向的就是该对象的原型对象。

![2678004328-ae93e0e517266b2a_fix732](JavaScript%E6%95%B4%E7%90%86%E4%B9%8B%E4%BB%8E%E5%8E%9F%E5%9E%8B%E5%88%B0%E5%8E%9F%E5%9E%8B%E9%93%BE/2678004328-ae93e0e517266b2a_fix732-16311800444655.png)

`__proto__`通常称为隐式原型，`prototype`通常称为显式原型，那我们可以说一个对象的隐式原型指向了该对象的构造函数的显式原型。那么我们在显式原型上定义的属性方法，通过隐式原型传递给了构造函数的实例。这样一来实例就能很容易的访问到构造函数原型上的方法和属性了。
我们之前也说过`__proto__`属性是对象（包括函数）独有的，那么`Parent.prototype`也是对象，那它有隐式原型么？又指向谁？

```js
Parent.prototype.__proto__ === Object.prototype; //true
```

可以看到，构造函数的原型对象上的隐式原型对象指向了Object的原型对象。那么Parent的原型对象就继承了Object的原型对象。由此我们可以验证一个结论，万物继承自Object.prototype。这也就是为什么我们可以实例化一个对象，并且可以调用该对象上没有的属性和方法了。如：

```javascript
//我们并没有在Parent中定义任何方法属性，但是我们可以调用
p1.toString();//hasOwnProperty 等等的一些方法
```

我们可以调用很多我们没有定义的方法，这些方法是哪来的呢？现在引出原型链的概念，当我们调用`p1.toString()`的时候，先在`p1`对象本身寻找，没有找到则通过`p1.__proto__`找到了原型对象`Parent.prototype`，也没有找到，又通过`Parent.prototype.__proto__`找到了上一层原型对象`Object.prototype`。在这一层找到了`toString`方法。返回该方法供`p1`使用。
当然如果找到`Object.prototype`上也没找到，就在`Object.prototype.__proto__`中寻找，但是`Object.prototype.__proto__ === null`所以就返回`undefined`。这就是为什么当访问对象中一个不存在的属性时，返回`undefined`了。

## constructor属性

![48568374-4a2ca8b9a839496e_fix732](JavaScript%E6%95%B4%E7%90%86%E4%B9%8B%E4%BB%8E%E5%8E%9F%E5%9E%8B%E5%88%B0%E5%8E%9F%E5%9E%8B%E9%93%BE/48568374-4a2ca8b9a839496e_fix732-16311803210376.png)

constructor是对象才有的属性，从图中看到它是从一个对象指向一个函数的。指向的函数就是该对象的构造函数。每个对象都有构造函数，好比我们上面的代码`p1`就是一个对象，那`p1`的构造函数是谁呢？我们打印一下。

```javascript
console.log(p1.constructor); // ƒ Parent(){}
```

通过输出结果看到，很显然是Parent函数。我们有说过函数也是对象，那Parent函数是不是也有构造函数呢？显然是有的。再次打印下。

```javascript
console.log(Parent.constructor); // ƒ Function() { [native code] }
```

通过输出看到Parent函数的构造函数是Function()，这点也不奇怪，因为我们每次定义函数其实都是调用了new Function()，下面两种效果是一样的。

```javascript
var fn1 = new Function('msg','alert(msg)');
function fn1(msg){
    alert(msg);
}
```

那么我们再回来看下，再次打印`Function.constructor`

```javascript
console.log(Function.constructor); // ƒ Function() { [native code] }
Function.constructor===Function //true
```

可以看到Function函数的构造函数就是本身了，那我们也就可以说Function是所有函数的根构造函数。
到这里我们已经对constructor属性有了一个初步的认识，它的作用是从一个对象指向一个函数，这个函数就是该对象的构造函数。通过栗子我们可以看到，`p1`的`constructor`属性指向了`Parent`，那么`Parent`就是`p1`的构造函数。同样`Parent`的`constructor`属性指向了`Function`，那么`Function`就是`Parent`的构造函数，然后又验证了`Function`就是根构造函数。

## 总结

![image-20210909175104199](JavaScript%E6%95%B4%E7%90%86%E4%B9%8B%E4%BB%8E%E5%8E%9F%E5%9E%8B%E5%88%B0%E5%8E%9F%E5%9E%8B%E9%93%BE/image-20210909175104199-16311810670437.png)

![image-20210909175134628](JavaScript%E6%95%B4%E7%90%86%E4%B9%8B%E4%BB%8E%E5%8E%9F%E5%9E%8B%E5%88%B0%E5%8E%9F%E5%9E%8B%E9%93%BE/image-20210909175134628-16311810962428.png)
