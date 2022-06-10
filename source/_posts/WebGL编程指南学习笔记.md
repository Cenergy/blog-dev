---
title: WebGL编程指南学习笔记
abbrlink: e6c6b2b1
date: 2019-10-21 20:18:06
tags: WebGL
---

个人计算机上使用最广泛的两种三维图形渲染技术是**Direct3D**和**OpenGL**。

Direct3D 是微软 DirectX 技术的一部分，是一套由微软控制的编程接口 API，主要用在 Windows 平台。
OpenGL 由于其开发和免费的特性，在多种平台上都有广泛的使用。

<!--more-->

**WebGL 是基于 OpenGL ES 2.0 的**。

OpenGL、OpenGL ES 1.1/2.0/3.0 和 WebGL 的关系。
![](WebGL%E7%BC%96%E7%A8%8B%E6%8C%87%E5%8D%97%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0/222059338585675.png)

从 2.0 版本开始，OpenGL 支持了一项非常重要的特性，即**可编程着色器方法**。该特性被 OpenGL ES 2.0 继承，并成为了 WebGL 1.0 标准的核心部分。

着色器，使用一种类似于 C 的编程语言实现了精美的视觉效果。编写着色器的语言又称为**着色器语言**。WebGL 基于 OpenGL ES 2.0，使用 GLSL ES 语言编写着色器

下图显示了 WebGL 程序的结构：
　　![](WebGL%E7%BC%96%E7%A8%8B%E6%8C%87%E5%8D%97%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0/222120593439118.png)

WebGL 需要两种着色器：

### 顶点着色器（ Vertex shader ）

顶点着色器是用来描述顶点特性（如位置、颜色等）的程序。顶点（vertex）是指二维或三维空间中的一个点，如二维或三维图形的端点或交点。

### 片元着色器（Fragment shader）

片元着色器是进行逐片元处理过程如光照的程序。片元（fragment）是一个 WebGL 术语，你可以将其理解为像素（图像的单元）。
