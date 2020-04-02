---
title: mapboxgl中解决图片动画的性能问题
abbrlink: 5796179d
date: 2020-04-02 20:45:16
tags: mapbox-gl
---

`mapbox-gl`中的动画图片是不断请求服务器得来的，详情请看[地址](https://docs.mapbox.com/mapbox-gl-js/example/animate-images/)，虽然是实现了，但一直请求不是好的解决办法，特别还是`mapbox-gl`这种追求性能极致的来说。我们可以有多种解决方法。

## 方案一：使用updateImage来解决

首先还是加载图层资源。

```js
 map.addSource('layerSourceName', {
      type: 'image',
      url: imageUrl,
      coordinates: coor, //计算后的四至坐标
 });
```

然后加载这个资源到图层。

最重要的来了，定时显示图片的环节。

<!--more-->

```js
//构造函数如下：   
constructor(id, option) {
        const { distance, level, coordinate, frameCount, urlPrifix } = option;
        this._id = id;
        this._distance = distance;
        this._level = level;
        this._coordinate = coordinate;
        this._frameCount = frameCount;
        this._currentImage = this._getRandomInt(1, option.frameCount - 1);
        this._layerSourceName = id;
        this._layerName = id;
        this._urlPrifix = urlPrifix;
        this._map = null;
        this._imagesMap = new Map();
    }   
// 定时显示图片
	tick() {
        let index = 1;
        const radarEffect = () => {
            if (index % 4 !== 0) {
                index += 1;
            } else {
                index = 1;
                const source = this.map.getSource(this._layerSourceName);
                this._currentImage = (this._currentImage + 1) % this._frameCount;
                if (!this._imagesMap.has(this._currentImage)) {
                    source.updateImage({ url: this._getPath(this._prefix, this._currentImage) });
                    if (source.image) {
                        this._imagesMap.set(this._currentImage, source.image);
                    }
                } else {
                    source.texture = null;
                    source.image = this._imagesMap.get(this._currentImage);
                    source._finishLoading.call(source);
                }
            }
            window.requestAnimationFrame(radarEffect);
        };
        window.requestAnimationFrame(radarEffect);
    }
	 _getPath() {
        return `${this._urlPrifix}/${this._currentImage}.png`;
    }
```

## 方案二：使用精灵图来解决。

话不多说，talk is cheap ,show my code

```js
        const pulsingDot = {
            width: size,
            height: size,
            data: new Uint8Array(size * size * 4),

            // get rendering context for the map canvas when layer is added to the map
            onAdd() {
                const canvas = document.createElement('canvas');
                canvas.width = this.width;
                canvas.height = this.height;
                this.context = canvas.getContext('2d');
                const image = new Image();
                image.src = './green.png';
                this.image = image;
                // 创建一个精灵图对象
                const sprite = new Sprite({
                    canvas,
                    image,
                    numberOfFrames: 10,
                    ticksPerFrame: 0,
                    row: 7,
                    column: 7,
                    x: 0,
                    y: 0,
                });
                this.sprite = sprite;
            },

            // called once before every frame where the icon will be used
            render() {
                const context = this.context;
                // console.log(`rdapp: render -> this`, this);

                // draw outer circle
                context.clearRect(0, 0, this.width, this.height);
                this.sprite.update();
                this.sprite.render();
                this.data = context.getImageData(0, 0, this.width, this.height).data;

                // continuously repaint the map, resulting in the smooth animation of the dot
                map.triggerRepaint();

                // return `true` to let the map know that the image was updated
                return true;
            },
        };
        map.on('load', () => {
            map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });

            map.addSource('points', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: [
                        {
                            type: 'Feature',
                            geometry: {
                                type: 'Point',
                                coordinates: mapConfig.center,
                            },
                        },
                    ],
                },
            });
            map.addLayer({
                id: 'points',
                type: 'symbol',
                source: 'points',
                layout: {
                    'icon-image': 'pulsing-dot',
                    'icon-rotation-alignment': 'map',
                },
            });
        });
```

