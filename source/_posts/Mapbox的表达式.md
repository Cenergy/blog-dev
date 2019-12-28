---
title: Mapbox的表达式
tags: mapbox
abbrlink: 9c1bf78f
date: 2019-10-18 09:52:50
---

## Expressions

mapbox-gl 的表达式可以将任何布局`layout`属性，绘图`paint`属性或过滤器`filter`的值指定为表达式。

![expression](Mapbox%E7%9A%84%E8%A1%A8%E8%BE%BE%E5%BC%8F/expression.jpg)

<!--more-->

### 图层样式结构

图层样式设置的结构为 JSON 结构，根级别结构如下：

```json
{
    "id": "road-layer-1",
    "type": "line",
    "source": "RoadSource",
    "source-layer": "Road",
    "layout": {...},
    "paint": {...},
    "minzoom": 6,
    "maxzoom": 17.5,
    "filter": [...]
}
```

字段定义说明如下：

**id**：图层 ID，必填项；说明：（值唯一，不能重复）

**type**：图层渲染类型，必填项；（值域范围，参考本章「概述」）

**source**：所使用的数据源 ID，说明：（当图层类型不为 background 时，该值为必填项）

**source-layer**：所使用的 vector 数据源中的图层标识，说明：（当数据源类型为 vector 时，该值为必填项；其它数据源类型，去除该参数）

**layout**：布局属性

**paint**：绘制属性

**minzoom**：图层可展示的最小缩放等级值，选填项；说明：（值为小数或整数，值域范围[0,24]，不设置该参数则地图允许的最小缩放等级内都可显示）

**maxzoom**：图层可展示的最大缩放等级值，选填项；说明：（值为小数或整数，值域范围[0,24]，不设置该参数则地图允许的最大缩放等级内都可显示）

**filter**：所使用数据源的 features 数据的过滤条件，选填项；说明：（当数据源 features 数据信息和 filter 条件匹配时图层才显示）

表达式定义了一个公式，用于使用以下描述的*运算符*计算属性的值。Mapbox GL 提供的表达式运算符集包括：

- Mathematical operators：数学计算器用于数值计算和其他数值相关的属性(如'+' '-' '\*' '/')
- Logical operators：用于操纵布尔值和进行条件决策的逻辑运算符(如'case' 'let')
- String operators：用于操纵字符串的字符串运算符(如 string 转 number)
- Data operators：提供调用数据源要素集属性的接口(如 ‘get')
- Camera operators：提供定义当前地图视角参数的接口(如 'zoom')

Expressions 表达式使用类似 Lisp 的语法，表达式数组的第一个元素是一个表示计算器的字符串，例如`*`或`case`。后面的元素是表达式的参数，每个参数要么是个原始的值（字符串、数字、布尔值或 null），要么是另一个表达式数组。

```json
[expression_name, argument_0, argument_1, ...]
```

### Data expressions

数据表达式是任何能够调用要素数据的表达式，这种表达式使用如下一种数据计算器：[`get`](https://www.mapbox.com/mapbox-gl-js/style-spec#expressions-get)、[`has`](https://www.mapbox.com/mapbox-gl-js/style-spec#expressions-has)、[`id`](https://www.mapbox.com/mapbox-gl-js/style-spec#expressions-id)、[`geometry-type`](https://www.mapbox.com/mapbox-gl-js/style-spec#expressions-geometry-type)、[`properties`](https://www.mapbox.com/mapbox-gl-js/style-spec#expressions-properties)、or `feature-state`。数据表达式利用要素集的属性或者状态来决定如何表达要素，它们可以在同一图层中创建不同的数据表达。

```json
{
  "circle-color": [
    "rgb",
    // red is higher when feature.properties.temperature is higher
    ["get", "temperature"],
    // green is always zero
    0,
    // blue is higher when feature.properties.temperature is lower
    ["-", 100, ["get", "temperature"]]
  ]
}
```

上面这个例子使用`get`运算符来获取每个要素的温度值，这个结果值被用作 rgb 运算符的属性值，rgb 运算符是用红绿蓝定义颜色的操作符。

数据表达式可以被用作 filter 的属性值和大多数布局`layout`属性、绘画`paint`属性值的计算。然而，一些绘画`paint`和布局`layout`属性并不支持数据表达式。支持级别可以在支持列表中查看。`feature-state`运算符的数据表达式仅适用于绘画`paint`属性中。

### Camera expressions

一个相机表达式是指任何使用 zoom 操作符的表达式，这些表达式允许一个图层改变地图的缩放等级。相机表达式可以用来创建表现的深度和控制数据密度。

```json
{
  "circle-radius": [
    "interpolate",
    ["linear"],
    ["zoom"],
    // zoom is 5 (or less) -> circle radius will be 1px
    5,
    1,
    // zoom is 10 (or greater) -> circle radius will be 5px
    10,
    5
  ]
}
```

这个例子使用`interpolate`插值运算符用来定义缩放等级和圆大小的线性相对关系，在这个例子中，表达式表明了圆半径在 zoom 等级为 5 或者更低时为 1 像素，在 zoom 等级为 10 或者更高时为 5 像素。在此之间的 zoom，半径线性的在 1 到 5 像素之间变化。

相机表达式在任何表达式使用的地方都能使用，然后当相机表达式用于布局`layout`属性或者绘画`paint`属性的值时，它必须是以下面形式中的一种：

```json
[ "interpolate", interpolation, ["zoom"], ... ]
```

或者：

```json
[ "step", ["zoom"], ... ]
```

或者：

```json
[
    "let",
    ... variable bindings...,
    [ "interpolate", interpolation, ["zoom"], ... ]
]
```

或者：

```json
[
    "let",
    ... variable bindings...,
    [ "step", ["zoom"], ... ]
]
```

也就是说，用于布局`layout`属性和绘画`paint`属性时，`zoom`操作符只能被用作为`interpolate`、`step`或者`let`这三种操作符的内在操作符。在布局`layout`属性和绘画`paint`属性中使用相机表达式有个重要的区别，绘画`paint`属性相机表达式当 zoom 等级发生即使很小变化时就能够重绘，例如一个绘画`paint`属性相机表达式会持续的变化，当 zoom 等级在 4.1 和 4.6 之间变动时。与此同时，布局`layout`属性相机表达式只会在 zoom 整数跳变时计算值，例如在 4.1 到 4.6 之间变化时不会重新计算值，除非是重 5 到 4.

### Composition

一个单独的表达式可能使用 data 操作符、相机操作符和其他操作符的混合。这种组合表达式使一个图层的渲染决定于缩放等级和单独要素属性的组合。

```json
{
  "circle-radius": [
    "interpolate",
    ["linear"],
    ["zoom"],
    // when zoom is 0, set each feature's circle radius to the value of its "rating" property
    0,
    ["get", "rating"],
    // when zoom is 10, set each feature's circle radius to four times the value of its "rating" property
    10,
    ["*", 4, ["get", "rating"]]
  ]
}
```

一个同时使用了 data 和 camera 运算符的表达式同时考虑了 data 和 camera 表达式。

http://dev.minedata.cn/api/dev/js/guide/layer/style

filter 规格

fliter 表示从所有图层过滤出特定特征的图层，有以下几种过滤形式：

1、存在过滤：

表达式形式：[way, key]

```
存在过滤主要有“has”、“!has”两种形式

["has", "count"]，表示过滤出存在属性"count"的所有的feature数据
["!has","count"]，表示过滤出不存在属性"count"的所有的feature数据
```

2、比较过滤：

表达式形式：[way, key, value]

```
比较过滤有等于“==”、大于“>”、小于“<”、不等于“!=”、大于等于“>=”、小于等于“<=”几种形式

["==", "count", "1000"]，表示过滤出属性"count"值为1000的feature数据，
//  注意此时数据源name存储的值为"1000"而不是1000 过滤时数据类型是严格匹配的
```

3、成员过滤：

计算形式：[way, key, v0,v1，…，vn]

```
成员过滤主要有"in"、"!in"两种形式

["in", "name", "point", "fill", "line"]，
//  表示过滤出属性"name"值为"point", "fill", "line"其中任一一个的feature数据
```

4、组过滤：

计算形式：[way, key, v0,v1，…，vn]

```
组过滤主要有组包含"arrin"、组不包含"!arrin"两种形式

["arrin", "name", "point", "fill"]，
//  表示过滤出属性"name"值为["point", "fill"]、["point"]、["fill"]其中任一一个的feature数据
//  属性"name"值为数组形式
```

5、模糊过滤：

计算形式：[way, key, value]

```
模糊过滤有“like”、开始于“start”、结束于“end”几种形式

["like", "code", "101"]，表示过滤出属性"code"值包含101的feature数据
//  属性"code"值为字符形式
```

6、组合过滤：

计算形式：[way, f0,f1，…，fn]

```
组合过滤主要有等于"all"、"any"、"none"三种形式
"all"表示满足所有过滤条件的数据，"any"表示满足任一一个过滤条件的数据，"none"表示过滤出不满足所有过滤条件的数据

["all", ["<=", "count", 34], ["like", "code", "101"]]，
//  表示过滤出属性"count"满足大于等于34，属性"code"值包含101的feature数据
```

函数对象语句

图层样式的某些 layout 或 paint 属性值支持函数对象语句的方式，属性值的最终结果由当前缩放等级或 feature 属性值进行相关计算而取得。

函数对象语句的结构为 JSON 结构，根级别结构如下：

```
{
    "property": "kind",
    "base": 1,
    "type": "interval",
    "default": "#000000",
    "stops": [...]
}
```

字段定义说明如下：

**property**：具体的 feature 属性标识；（非必输项）

**base**：差值运算的曲率指数基数，控制最终计算结果值的增长率，值越大，最终计算结果值越大，值为 1 时，函数采用线性计算方式；（数值类型，默认值为 1）

**stops**：差值运算项，定义输入值和输出值的集合，每一个 stop 由一个输入值和一个输出值组成；（数组形式，当 type 不为'identity'时，stops 为必输项）

**type**：函数对象计算类型；（值域为["identity", "exponential","interval", "categorical"]，默认值为'interval'）

**1、identity**：恒等类型，最终输出值完全等于输入值；

```
/*示例：建筑物高度取用建筑物feature中的的属性字段levels的值*/
{
    "extrusion-height": {
        "type": "identity",
        "property": "levels"
    }
}
```

**2、exponential**：指数类型，最终输出值由 stops 中的差值项进行区间范围内的指数级差值计算生成，stops 中的输入参数必须为数值类型；

```
/*示例：线的颜色值由feature中的price值进行区间指数级差值运算取得*/
{
    "line-width": {
        "property": "price",
        "type": "exponential",
        "stops": [[0, 1],[10, 2],[200, 3],[300, 4]],
        "default": 1
    }
}
```

**3、interval**：区间类型，最终输出值由 stops 中的差值项进行区间范围内的阶梯型差值计算生成，stops 中的输入参数必须为数值类型；

```
/*示例：线的颜色值由feature中的status值进行区间差值运算取得*/
{
    "line-color": {
        "property": "status",
        "type": "interval",
        "stops": [[0, "#999999"],[1, "#66cc00"],[2, "#ff9900"],[3, "#cc0000"],[4, "#9d0404"]],
        "default": "#66cc00"
    }
}

/*示例：表示线宽根据zoom的值进行差值运算，当不添加type属性时，默认为interval类型*/
{
    "line-width": {
        "base": 1.2,
        "stops": [[5, 0.8], [20, 6]]
    }
}
```

**4、categorical**：种别类型，最终输出值完全匹配 stops 中的输入值对应的输出值；

```
/*示例：面颜色由feature中的的属性字段space_type的值匹配stop中的输入值取得输出值*/
{
    "line-color": {
        "property": "space_type",
        "type": "categorical",
        "stops": [[1, "#f8e4d4"], [3, "#f5e8ca"], [5, "#f1d4ef"], [7, "#f7e8c3"], [9, "#f0d3ef"]]
        "default": "#f1ebe7"
    }
}
```

**default**：默认值，当差值运算没有结果时取用默认值；会在以下境况中遇到：

1、函数对象为**categorical**类型：当 feature 属性值不匹配 stops 中的输入值时；

2、函数对象为**identity**类型：当 feature 属性值不存在或属性值无效时；

3、函数对象为**interval 或 exponential**类型：当 feature 属性值不是数值类型时；
