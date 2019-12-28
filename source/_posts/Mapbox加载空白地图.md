---
title: Mapbox加载空白地图
tags: mapbox
abbrlink: e1a3a842
date: 2019-10-16 20:37:23
---

由于 mapbox 的服务器在国外，在开发的时候有可能加载很慢，而且大多时候与背景地图无关，此时可以加载一个空白的地图来增加加载速度从而提高开发效率。

![1571374714735](Mapbox%E5%8A%A0%E8%BD%BD%E7%A9%BA%E7%99%BD%E5%9C%B0%E5%9B%BE/1571374714735.jpg)

<!--more-->

代码如下：

```javascript
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Add an image</title>
    <meta
      name="viewport"
      content="initial-scale=1,maximum-scale=1,user-scalable=no"
    />
    <script src="https://api.tiles.mapbox.com/mapbox-gl-js/v0.53.1/mapbox-gl.js"></script>
    <link
      href="https://api.tiles.mapbox.com/mapbox-gl-js/v0.53.1/mapbox-gl.css"
      rel="stylesheet"
    />
    <style>
      body {
        margin: 0;
        padding: 0;
      }
      #map {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script>
      const blankStyle = {
        version: 8,
        name: "BlankMap",
        sources: {},
        layers: [
			{
        	id: 'background',
        	type: 'background',
        	paint: { 'background-color': '#08294A' } /* 背景颜色 */
      		}
		]
      };

      var map = new mapboxgl.Map({
        container: "map",
        zoom: 3,
        center: [0, 0],
        style: blankStyle
      });
    </script>
  </body>
</html>
```
