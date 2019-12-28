---
title: JavaScript面向对象编程总结
abbrlink: 9364fbab
date: 2019-09-19 12:35:34
tags: javascript
---

## What is Object-oriented Programming

![1569242664504](JavaScript%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%BC%96%E7%A8%8B%E6%80%BB%E7%BB%93/1569242664504.png)

<!-- more-->

<div class="note info">OOP是一种编程范例，或者编程风格，这是围绕对象而不是函数</div>
面向对象编程中的四个核心概念

`Encapsulation`---封装 `Abstraction`---抽象 `Inheritance`---继承 `Polymorphism`---多态

区别与面向过程编程

![1568869135169](JavaScript%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%BC%96%E7%A8%8B%E6%80%BB%E7%BB%93/1568869135169.png)

![1568868905016](JavaScript%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%BC%96%E7%A8%8B%E6%80%BB%E7%BB%93/1568868905016.png)

<div class="note danger">改变了其中一个函数，然后其他几个函数可能就奔溃了，这就是我们说的意大利面条代码。
函数之间深层次的关联变成了各种问题的来源，OOP就应运而生。</div>

![1568869159417](JavaScript%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%BC%96%E7%A8%8B%E6%80%BB%E7%BB%93/1568869159417.png)

OOP 就一组相关的变量和函数组成合成一个单元，我们称之为对象(object)。把里面的函数称为方法，里面的变量称之为属性。

![1568869302595](JavaScript%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%BC%96%E7%A8%8B%E6%80%BB%E7%BB%93/1568869302595.png)

<div class="note info">最好的函数是那些没有参数的函数，参数个数越少，使用和维护就越简单。这就是封装！</div>
![1568869634914](JavaScript%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%BC%96%E7%A8%8B%E6%80%BB%E7%BB%93/1568869634914.png)



![1568869889043](JavaScript%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%BC%96%E7%A8%8B%E6%80%BB%E7%BB%93/1568869889043.png)

<div class="note info">多态意味着多种形态</div>
![1568873343511](JavaScript%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%BC%96%E7%A8%8B%E6%80%BB%E7%BB%93/1568873343511.png)

![1568873363029](JavaScript%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%BC%96%E7%A8%8B%E6%80%BB%E7%BB%93/1568873363029.png)

<div class="note success">使用封装重新组合的相关的变量和函数，这样可以减少复杂性，可以在程序的不同部分重用这些对象
    或者在不同程序中，通过抽象，隐藏细节和复杂性，只显示必要性，这种技术降低了复杂性，也隔离了代码更改的影响。
    继承让我们消除多余的代码
	多态性可以避免写出复杂丑陋的选择性代码</div>

![1568873756718](JavaScript%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%BC%96%E7%A8%8B%E6%80%BB%E7%BB%93/1568873756718.png)

## 原型与原型继承

原型`Prototypes` 和 原型继承`Prototyical Inheritance`

JavaScript 中的类并不同于 Java 或者 c#中的类，因为 Javascript 是动态语言，所以类的本质上是更像是为了配合原型和原型继承所采取的必要的技术。

```javascript
//使用字面量创建对象
const circle = {};
//一个Javascript的对象实际上是一组键值对的集合
//使用字面量语法来创建多个对象是有问题的，那就是对象的行为性，就像人一样可以做很多事就叫做行为性。
//解决方法就是用工厂函数（factory）或者构造函数（constructor）

//工厂函数
function createCircle(radius) {
  return {
    radius,
    draw() {
      console.log("draw");
    }
  };
}
const circle2 = createCircle(1);
// 构造函数
function Circle(radius) {
  this.radius = raius;
  this.draw = function() {
    console.log("draw");
  };
}
const circle3 = new Circle(2);
//当我们使用new操作符调用一个函数时，3件事发生了
//首先new操作符创建了一个空对象，然后设置this指向这个对象，最后返回这个对象
```

补充：

[字面量](https://www.baidu.com/s?wd=字面量&tn=SE_PcZhidaonwhc_ngpagmjz&rsv_dl=gh_pc_zhidao)是变量的字符串表示形式。它不是一种值，而是一种变量记法。

```javascript
const a = 1; //1是字面量
const b = "hello world"; //hello world是字面量
const c = [1, 2, 3]; //[1,2,3]是字面量
const d = { foo: "bar" }; //{"foo":"bar"}是字面量
```

每个对象都有构造函数属性

这个属性引用了用来创建这个对象的构造函数

```javascript
new String(); // ''," ",``
new Boolean(); // true ,false
new Number(); //1,2,3,4,5,6
new Object(); //{}
```

![1568897883740](JavaScript%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%BC%96%E7%A8%8B%E6%80%BB%E7%BB%93/1568897883740.png)

<div class="note info"><p>值类型复制值</p><p>对象或者引用类型复制他们的引用</p></div>
```js
let number=10;
function increase(number){
    number++;
}
increase(number);
console.log(number) //10

let object={value:10};
function increase(object){
object.value++;
}
increase(object);
console.log(object) //{value:11}

````

不知道要访问的对象名称属性，是在运行时产生的，可以使用方括号的语法,或者属性名不符合命名规则时。

抽象意味着我们应该隐藏细节和复杂部分，只显示或者暴露必要的部分

```js
this.defaultLocaltion={x:0,y:1} // ====> let defaultLocaltion={x:0,y:1}
Object.defineProperty(this,'defaultLocaltion',{
    get(){
        return defaultLocaltion
    },
    set(value){
        defaultLocaltion=value
    }
})
```



<div class="note info">Javascript 中没有类，只有对象，那只有对象的时候如何引入继承？答案是原型。
原型可以理解为一个对象的父母，原型就是一般的对象。</div>

```javascript
const person = { name: "hello" };
Object.defineProperty(person, "name", {
writable: false,
enumerable: true,
configurable: false
});
delete person.name;
console.log(person); // { name: 'hello' }
```



获得对象原型的方法是调用 Object 对象的 getPrototypeOf 方法

```javascript
function Circle(radius) {
  this.radius = radius;
}
const circle = new Circle(1);
Circle.prototype; //这是构造函数创建的对象的父母真身
circle.__proto__ === Circle.prototype; // true
```



Object.keys 只返回实例的成员

for-in 循环返回所有的成员，对象实例本身的和它的原型的

![1568956155416](JavaScript%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%BC%96%E7%A8%8B%E6%80%BB%E7%BB%93/1568956155416.png)

![1568982071111](JavaScript%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%BC%96%E7%A8%8B%E6%80%BB%E7%BB%93/1568982071111.png)

在 Javascript 中，有个函数可以从给定的原型创建对象，就是 Object.create(第一个参数是用作创建的原型)

Javascript 里每个对象都有一个构造函数属性，能返回用以创建这个对象的构造函数

避免创建层级式继承关系，因为这十分脆弱。如果要用继承特性，最好维持在一级。好的组合胜过继承。

![1568984473440](JavaScript%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%BC%96%E7%A8%8B%E6%80%BB%E7%BB%93/1568984473440.png)

![1568984534425](JavaScript%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%BC%96%E7%A8%8B%E6%80%BB%E7%BB%93/1568984534425.png)

<div class="note info">Object.assign()可以用这个方法从一个对象拷贝所有成员到另外一个对象</div>
```javascript
      const canEat = {
        eat: function() {
          console.log("eating");
        }
      };
      const canWalk = {
        walk: function() {
          console.log("eating");
        }
      };
      const canSwin = {
        swin: function() {
          console.log("swining");
        }
      };
      //   const person = Object.assign({}, canEat, canWalk);
		// 空对象实际上变成了2个对象的组合
      //   console.log(person);
      function mixins(target, ...sources) {
        Object.assign(target.prototype, ...sources);
      }
      //   function Person() {}
      //   Object.assign(Person.prototype, canEat, canWalk);
      //   console.log(new Person());
      function Dog() {}
      mixins(Dog, canEat, canWalk);
      console.log(new Dog());
      function GoldFish() {}
      mixins(GoldFish, canEat, canSwin);
      console.log(new GoldFish());
```

## ES6

函数声明 `funciton sayHello(){}` 结尾不需要加分号，函数声明是置顶的。

函数表达式`const sayGoodbye=function(){}` 结尾需要加分号，不会被置顶。

不同于函数，类声明和类表达式都不会被置顶

实例方法和静态方法

```js
class Circle {
  constructor(radius) {
    this.radius = radius;
  }
  // Instance Method
  draw() {}
  // Static Mthod
  static parse(str) {
    const { radius } = JSON.parse(str);
    return new Circle(radius);
  }
}
const circle = Circle.parse('{"radius":1}');
console.log("Go: circle", circle); // Go: circle Circle { radius: 1 }
```

所以我们用静态方法的方式创建不属于具体实例的工具函数

```js
const c = new Circle(2);
// Method call
c.draw(); // Circle { radius: 2 }
const draw = c.draw;
// Function call
draw(); // undefined
```

ES6 私有

第一种是用在命名的时候加下划线

第二种是使用 Symbol

```js
const _radius = Symbol();
const _draw = Symbol();
// Symbol() 是一个函数，能创建一个Symbol，这个不是构造函数，不能在前面加new修饰符，这样会报错
class Circle {
  constructor(radius) {
    this[_radius] = radius;
  }
  [_draw]() {
    // 计算生成属性
  }
}

const c = new Circle(1);
const key = Object.getOwnPropertySymbols(c)[0];
console.log(c[key]); // 1
```

第三种是使用 WeakMap

```js
const _radius = new WeakMap();
const _move = new WeakMap();
class Circle {
  constructor(radius) {
    _radius.set(this, radius);
    _move.set(this, () => {
      // 箭头函数将从调用它的构造器继承过来，在这个构造器里。this是circle对象实例的引用。
      // 当我们在构造器函数里使用箭头函数时，this不会重新绑定，也不会重设，直接从构造器继承
      console.log("moving", this);
    });
  }
  draw() {
    _move.get(this)();
    console.log("drawing...");
  }
}

const c = new Circle(2);
c.draw();
```

getter&&setter

方法重写

```javascript
class Shape {
  move() {
    console.log("moving....");
  }
}
class Circle extends Shape {
  move() {
    super.move();
    console.log("circle move");
  }
}

const c = new Circle();
```

![1569201901993](JavaScript%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%BC%96%E7%A8%8B%E6%80%BB%E7%BB%93/1569201901993.png)

AMD，也就是异步模块定义，主要是在浏览器程序中使用。

![1569202170920](JavaScript%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%BC%96%E7%A8%8B%E6%80%BB%E7%BB%93/1569202170920.png)

![1569202287766](JavaScript%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%BC%96%E7%A8%8B%E6%80%BB%E7%BB%93/1569202287766.png)

CommonJS

> class Circle{
>
> }
>
> module.exports.Circle=Circle
>
> 只需要引入一个模块时，可以简化代码`module.exports=Circle`
>
> 引入时，使用 require 函数。
>
> 所以时 CommonJS 定义了 require 函数和 module 函数，这是 CommonJS 当中的语法。

ES6

> export && import
>
> <script type="module" src="../"></script>

在模块化之前，要记住一个首要原则，高度关联的东西应该放在一起。就好比在厨房放置了杯子盘子勺子等餐具，不应该把衣服存放在厨房，这就是高度关联。这就是编程中说的 Cohesion(内聚)。

![1569203914069](JavaScript%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%BC%96%E7%A8%8B%E6%80%BB%E7%BB%93/1569203914069.png)

## Webpack

- npm i -g webpack-cli
- webpack-cli init
- npm init --yes

[完结](https://www.bilibili.com/video/av35179218/?p=1)
