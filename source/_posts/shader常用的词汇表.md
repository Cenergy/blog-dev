---
title: shader常用的词汇表
index_img: 'https://www.aigisss.com/static/images/bg.jpg'
abbrlink: shaderglossary
categories: 着色器
date: 2020-09-16 19:01:26
tags:
---
## 类型

### void

### bool

### int

### float

### bvec2

### bvec3

### bvec4

### ivec2

### ivec3

### ivec4

### mat2

### mat3

### mat4

`4x4`浮点矩阵

声明

```glsl
mat4 aMat4 = mat4(1.0, 0.0, 0.0, 0.0,  // 1. column
                  0.0, 1.0, 0.0, 0.0,  // 2. column
                  0.0, 0.0, 1.0, 0.0,  // 3. column
                  0.0, 0.0, 0.0, 1.0); // 4. column
mat4 bMat4 = mat4(1.0);
mat4 cMat4 = mat4(aVec4, bVec4, cVec4, dVec4);
mat4 dMat4 = mat4(aVec4, aVec3, bVec4, cVec4, aFloat);
```

`mat4`数据类型是由浮点`4x4`矩阵组成的。如上所示，可以通过不同的方式初始化： 

- 逐列为每个组件提供值。 
- 提供一个用于主对角线上的组件的值。 
- 提供向量和标量的组合。 

以同样的方式，可以按组件方式或按列访问数据： 

```glsl
aMat4[3][3] = 1.0;
float aFloat = aMat4[3][3];

aMat4[0] = vec4(1.0);
vec4 aVec4 = aMat4[0];
```

### smapler2D

### smaplerCube

### struct

结构变量类型,例子

```glsl
struct matStruct {
    vec4 ambientColor;
    vec4 diffuseColor;
    vec4 specularColor;
    float specularExponent;
} newMaterial;

newMaterial = matStruct(vec4(0.1, 0.1, 0.1, 1.0),
                        vec4(1.0, 0.0, 0.0, 1.0),
                        vec4(0.7, 0.7, 0.7, 1.0),
                        50.0);
```

#### 描述 

`struct`声明基于标准类型的自定义数据结构。具有相同名称的结构的构造函数将自动创建。变量的声明（在本例中为` newMaterial`）是可选的。

## 限定词

### attribute

顶点属性数据。

例如:

```glsl
attribute vec4 v_color;
```

`attribute` 只读变量，包含从WebGL / OpenGL环境共享到顶点着色器的数据。

由于顶点着色器对每个顶点执行一次，因此通常为每个顶点数据指定属性，并使用以下信息：顶点的空间位置，颜色，法线方向和纹理坐标。

### const

常量限定词

例如:

```glsl
const float PI = 3.14159265359;
```

const限定符可以应用于任何变量的声明，以指定其值不会更改。

### uniform

统一变量限定符。

例子:

```glsl
uniform vec4 direction;
```

`uniform` 变量包含从WebGL / OpenGL环境共享到顶点或片段着色器的只读数据。 该值是针对每个图元的，因此对于在图元，帧或场景中保持不变的变量很有用。

### varying

可变变量限定符。

例子:

```glsl
varying vec3 position;
```

`varying` 变量包含从顶点着色器到片段着色器共享的数据。 必须在顶点着色器中写入变量，然后从组成片段的顶点内插片段着色器中的只读值。

### precision

### highp

### mediump

### lowp

### in

### out

### inout

## 内置变量

### gl_Position

### gl_PointSize

### gl_PointCoord

### gl_FrontFacing

### gl_FragCoord

### gl_FragColor

## 内置常数

### gl_MaxVertexAttribs

### gl_MaxVaryingVectors

### gl_MaxVertexTextureImageUnits

### gl_MaxCombinedTextureImageUnits

### gl_MaxTextureImageUnits

### gl_MaxFragmentUniformVectors

### gl_MaxDrawBuffers

## 角度和三角函数

### radians()

将数量转换为弧度

```glsl
float radians(float degrees) 
vec2 radians(vec2 degrees) 
vec3 radians(vec3 degrees) 
vec4 radians(vec4 degrees)
```

参数:`degrees`指定要转换为弧度的数量（以度为单位）。

描述:`radians()` 将以度为单位的数量转换为弧度。即返回值为`(PI * degrees)/180`。

### degrees()

将弧度转换为度

```glsl
float degrees(float radians)  
vec2 degrees(vec2 radians)  
vec3 degrees(vec3 radians)  
vec4 degrees(vec4 radians)
```

参数:`radians`指定要转换为度的数量（以弧度为单位）。

描述:`degrees()` 将以弧度表示的数量转换为度数。 也就是说，返回值为`(180.0*radians)/PI`

### sin()

返回参数的正弦

```glsl
float sin(float angle)  
vec2 sin(vec2 angle)  
vec3 sin(vec3 angle)  
vec4 sin(vec4 angle)
```

参数:`angle` 指定以弧度表示的要返回正弦的量。

描述:`sin()`返回角度的三角正弦值。

### cos()

### tan()

### asin()

### acos()

### atan()

## 指数函数

### pow()

将第一个参数的值返回第二个参数的幂。

```glsl
float pow(float x, float y)  
vec2 pow(vec2 x, vec2 y)  
vec3 pow(vec3 x, vec3 y)  
vec4 pow(vec4 x, vec4 y)
```



### exp()

返回参数的自然幂

```glsl
float exp(float x)  
vec2 exp(vec2 x)  
vec3 exp(vec3 x)  
vec4 exp(vec4 x)
```



### log()

### exp2()

### log2()

### sqrt()

### inversesqrt()

## 常用函数

### abs()

### sign()

### floor()

### ceil()

### fract()

计算参数的小数部分

```glsl
float fract(float x)  
vec2 fract(vec2 x)  
vec3 fract(vec3 x)  
vec4 fract(vec4 x)
```

`x`指定要评估的值。

​	`fract()`返回x的小数部分。计算公式为`x-floor(x)`。

### mod()

计算一个参数取模的值

```glsl
float mod(float x, float y)  
vec2 mod(vec2 x, vec2 y)  
vec3 mod(vec3 x, vec3 y)  
vec4 mod(vec4 x, vec4 y)

vec2 mod(vec2 x, float y)  
vec3 mod(vec3 x, float y)  
vec4 mod(vec4 x, float y)
```

参数:`x`指定要评估的值。 `y`指定要获取其模数的值。

描述:`mod()`返回x模y的值。计算为`x-y * floor(x / y)`。

### min()

### max()

### clamp()

### mix()

### step()

通过比较两个值生成阶跃函数

```glsl
float step(float edge, float x)  
vec2 step(vec2 edge, vec2 x)  
vec3 step(vec3 edge, vec3 x)  
vec4 step(vec4 edge, vec4 x)

vec2 step(float edge, vec2 x)  
vec3 step(float edge, vec3 x)  
vec4 step(float edge, vec4 x)
```

参数:

`edge`指定步进函数的边缘位置。

`x`指定用于生成步进函数的值。

描述:

`step()`通过将`x`与`edge`进行比较来生成step函数。 对于返回值的元素`i`，如果`x[i] <edge[i]`返回`0.0`，否则返回`1.0`。

### smoothstep()

在两个值之间执行Hermite插值

```glsl
float smoothstep(float edge0, float edge1, float x)  
vec2 smoothstep(vec2 edge0, vec2 edge1, vec2 x)  
vec3 smoothstep(vec3 edge0, vec3 edge1, vec3 x)  
vec4 smoothstep(vec4 edge0, vec4 edge1, vec4 x)

vec2 smoothstep(float edge0, float edge1, vec2 x)  
vec3 smoothstep(float edge0, float edge1, vec3 x)  
vec4 smoothstep(float edge0, float edge1, vec4 x)
```

参数:

`edge0`指定Hermite函数下边缘的值。

`edge1`指定Hermite函数的上边缘的值。

`x`指定插值的源值。

描述:

当`edge0 <x <edge1`时，`smoothstep()`在0和1之间执行平滑的Hermite插值。这在需要具有平稳过渡的阈值函数的情况下很有用。 `smoothstep()`等效于：

```c
    genType t;  /* Or genDType t; */
    t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
```

如果`edge0≥edge1`，则结果是`undefined `。

## 几何函数

### length()

### distance()

### dot()

计算两个向量的点积

```glsl
float dot(float x, float y)  
float dot(vec2 x, vec2 y)  
float dot(vec3 x, vec3 y)  
float dot(vec4 x, vec4 y)
```

参数:`x`指定两个向量中的第一个 ,`y`指定两个向量中的第二个

描述:`dot()`返回两个向量x和y的点积。 即`x[0]·y[0] + x[1]·y[1] + ...`如果x和y相同，则点积的平方根等于向量的长度。 输入参数可以是浮标量或浮标向量。 如果是浮标量，则点函数是微不足道的，并返回x和y的乘积。

### cross()

计算两个向量的叉积

```glsl
vec3 cross(vec3 x, vec3 y)
```

参数:	`x`指定两个向量中的第一个,`y`指定两个向量中的第二个.

描述:

`cross()`返回两个向量x和y的叉积。 输入参数只能是3分量浮点向量。 叉积等于向量长度乘以x和y之间（较小）角的正弦值的乘积。

### normalize()

计算与输入向量相同方向的单位向量

```glsl
float normalize(float x)  
vec2 normalize(vec2 x)  
vec3 normalize(vec3 x)  
vec4 normalize(vec4 x)
```

`x`指定要归一化的向量。

描述:`normalize()`返回一个向量，向量的方向与其参数x相同，但长度为1。

### facefoward()

返回指向与另一个方向相同的向量

```glsl
float faceforward(float N, float I, float Nref) 
vec2 faceforward(vec2 N, vec2 I, vec2 Nref) 
vec3 faceforward(vec3 N, vec3 I, vec3 Nref) 
vec4 faceforward(vec4 N, vec4 I, vec4 Nref)
```

### reflect()

### refract()

## 矩阵函数

### matrixCompMult()

执行两个矩阵的按分量乘法

```glsl
mat2 matrixCompMult(mat2 x, mat2 y)  
mat3 matrixCompMult(mat3 x, mat3 y)  
mat4 matrixCompMult(mat4 x, mat4 y)
```

参数:

`x`指定第一个矩阵被乘数。

 `y`指定第二个矩阵被乘数。

描述:

`matrixCompMult()`对两个矩阵进行按分量乘法，生成结果矩阵，其中每个分量`result[i][j]`计算为`x[i][j]`和`y[i][j]`的标量积

## 向量函数

### lessThan()

### lessThanEqual()

### greaterThan()

### greaterThanEqual()

### equal()

### notEqual()

### any()

### all()

### not()

## 纹理查找函数

### texture2D()

### textureCube()

