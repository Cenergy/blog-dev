---
title: 'mapbox的矢量切片工具:tippecanoe'
index_img: /images/pages/logo-mapbox-tippecanoe.png
abbrlink: 4ef7fe51
categories: mapbox
date: 2020-09-20 21:49:46
tags: Mapbox
---
# 矢量切片工具：tippecanoe

Tippecanoe 用于将 GeoJSON, Geobuf, 或者 CSV 格式的矢量要素转换为[矢量瓦片](https://www.mapbox.com/developers/vector-tiles/)。

## 目的

Tippecanoe 的目的是将数据制作为比例独立的视图，以使在任何缩放级别下，你都可以看到数据的密度和细节，而不是将数据简化或聚合。
如果你提供的是 OpenStreetMap 所有的数据，在小比例尺下，你应该看到类似于[All Streets](https://benfry.com/allstreets/map3.html)的地图，而不是州际道路地图。
如果你提供的是洛杉矶的所有详细的建筑数据，并且将地图缩放到小比例尺下，绝大部分的单体建筑将不再可辨，但是你应该可以看到每个街区的范围和变化。
如果你提供的是一年内 twitter 推文的定位数据集，你应该可以发现所有兴趣点之间的关联和热门的旅游路线。

## 安装

- OSX 操作系统使用 Homebrew 安装：

  ```bash
  $ brew install tippecanoe
  ```

- Ubuntu 系统最简单的方式是从源码中构建：

  ```bash
  $ git clone git@github.com:mapbox/tippecanoe.git
  $ cd tippecanoe
  $ make -j
  $ make install
  ```

- Window系统的最简单的方式是安装一个Ubuntu系统：

  在windows10 第3个稳定版发布以后，支持内嵌的linux系统，下面我们一起来看看，怎么使用它内部自带的linux系统。

  https://jingyan.baidu.com/article/c85b7a64a56c7f003aac954f.html

如果编译中出现问题，可能是你的C++编译器需要升级，或者缺少必要的依赖包，详细请查看[文档](https://github.com/cgcs2000/tippecanoe#development)。

## 使用

```bash
$ tippecanoe -o file.mbtiles [options] [file.json file.json.gz file.geobuf ...]
```

如果没有指定文件，会从默认路径读取 GeoJSON 文件；如果指定了多个文件，每一个文件将会被当做一个图层。
GeoJSON 要素不一定非得包含在 FeatureCollection 中。你可以将多个 GeoJSON 要素或者文件合并。

## Try this first

如果你不确定使用什么选项，请尝试一下命令：

```bash
$ tippecanoe -o out.mbtiles -zg --drop-densest-as-needed in.geojson
```



使用`-zg` 选项，Tippecanoe 将自动选择一个可以反映原始数据精度的最大级别（如果结果没有达到你想要的效果，你也可以使用`-z` 选项手动设置最大级别）。
如果生产出的切片太大，可以使用 `--drop-densest-as-needed`选项，来让Tippecanoe自动删除各个级别下最不可见的要素。（如果它删除了太多的要素，你可以使用`-x`选项来删除不必要的属性字段）

## 选项

tippecanoe 切片有很多选项，但是大部分情况下你并不想要使用它们，除了使用 `-o output.mbtiles`
来定义输出瓦片文件名，或者再加上`-f` 选项来强制删除同名文件。

如果你不确定需要切片的最大级别，`-zg` 选项可以根据源数据自动计算出一个最大级别。

通常，在最大切片级别以下的级别，tippecanoe 会舍弃部分点要素，以防止瓦片过大。如果你的数据集本来就不大，你想要保留所有要素，可以使用`-r1`选项。如果你确实是想要简化数据，但是又不想简化得过于稀疏，可以使用 `-B` 选项设置一个小于最大级别的数值。

通过以上设置，如果你的切片仍然很大，你可以使用 `--drop-densest-as-needed` 选项来进一步简化要素。

如果你的要素包含很多属性，你可以使用`-y`选项来选择只保留你给定的字段。

如果你的GeoJSON 文件是格式化后的，使用`-p`可以加快文件读取。

### 输出选项

- `-o file.mbtiles` 或 `--output=file.mbtiles`：指定输出文件名
- `-e directory` 或 `--output-to-directory=directory`：指定输出文件路径
- `-f` 或 `--force`：若存在同名文件则删除
- `-F` 或 `--allow-existing`

### 瓦片集属性选项

- `-n name` 或 `--name=name`: 给瓦片集设置一个易读的名字
- `-A text` 或 `--attribution=text`： 瓦片集
- `-N description` 或 `--description=description`: 瓦片集描述

### 输入文件和图层名

- `name.json` 或 `name.geojson`：读取 GeoJSON 文件

- `name.json.gz` 或 `name.geojson.gz`：读取 GeoJSON 压缩文件

- `name.geobuf`：读取 Geobuf 文件

- `name.csv`：读取 CSV 文件

- `-l name` 或 `--layer=name`: 使用自定义图层名，而不是默认的输入文件名作为图层名，如果有多个输入文件，将合并为一个图层，除非使用`-L`选项来分别指定图层名。

- `-L name:file.json` 或 `--named-layer=name:file.json`：定义每个文件的对应的图层名

- `-L{layer-json} `或 `--named-layer={layer-json}`: 通过 json 对象定义图层。示例：

  ```bash
  tippecanoe -z5 -o world.mbtiles -L'{"file":"ne_10m_admin_0_countries.json", "layer":"countries", "description":"Natural Earth countries"}'
  ```

### 坐标系

- `-s projection` 或 `--projection=projection`: 给定输入文件的坐标系统。当前支持的坐标系有`EPSG:4326`（WGS84，默认值）、`EPSG:3857`（Web Mercator）。请尽量使用 WGS84 坐标系统的数据集。

### 切片级别

- `-z zoom` 或 `--maximum-zoom=zoom`:切片的最大级别（默认为14）
- `-zg` 或 `--maximum-zoom=g`: 根据数据的密集程度自动计算一个最大级别
- `-Z zoom` 或 `--minimum-zoom=zoom`: 切片的最小级别（默认0）
- `-ae` 或 `--extend-zooms-if-still-dropping`: 如果在大级别下瓦片仍然很大，它将自动增加最大级别，以使最大级别下没有要素被删除
- `-R zoom/x/y` 或 `--one-tile=zoom/x/y`:

如果你知道你想要的切片的数据精度，那么你就可以根据以下表格来设置切片级别：

| 级别   | 精度 (英尺) | 精度 (m) |
| :----- | :---------- | :------- |
| `-z0`  | 32000 ft    | 10000 m  |
| `-z1`  | 16000 ft    | 5000 m   |
| `-z2`  | 8000 ft     | 2500 m   |
| `-z3`  | 4000 ft     | 1250 m   |
| `-z4`  | 2000 ft     | 600 m    |
| `-z5`  | 1000 ft     | 300 m    |
| `-z6`  | 500 ft      | 150 m    |
| `-z7`  | 250 ft      | 80 m     |
| `-z8`  | 125 ft      | 40 m     |
| `-z9`  | 64 ft       | 20 m     |
| `-z10` | 32 ft       | 10 m     |
| `-z11` | 16 ft       | 5 m      |
| `-z12` | 8 ft        | 2 m      |
| `-z13` | 4 ft        | 1 m      |
| `-z14` | 2 ft        | 0.5 m    |
| `-z15` | 1 ft        | 0.25 m   |

### 属性筛选

- `-x name` 或 `--exclude=name`： 指定切片中应剔除的字段。
- `-y name` 或 `--include=name`： 指定切片中应包含的字段。

## Cookbook

### 线要素（全球铁路），在所有级别可见

```bash
curl -L -O https://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/cultural/ne_10m_railroads.zip
unzip ne_10m_railroads.zip
ogr2ogr -f GeoJSON ne_10m_railroads.geojson ne_10m_railroads.shp

tippecanoe -zg -o ne_10m_railroads.mbtiles --drop-densest-as-needed --extend-zooms-if-still-dropping ne_10m_railroads.geojson
```

- `-zg`: 自动选择最大级别；
- `--drop-densest-as-needed`: 如果在小级别下瓦片太大，该选项将自动简化要素；
- `--extend-zooms-if-still-dropping`: 如果在大级别下瓦片仍然很大，它将自动增加最大级别，以使最大级别下没有要素被删除；

### 不连续的面要素（美国罗德岛），在所有级别可见

```bash
curl -L -O https://usbuildingdata.blob.core.windows.net/usbuildings-v1-1/RhodeIsland.zip
unzip RhodeIsland.zip

tippecanoe -zg -o RhodeIsland.mbtiles --drop-densest-as-needed --extend-zooms-if-still-dropping RhodeIsland.geojson
```

- `-zg`: 自动选择最大级别；
- `--drop-densest-as-needed`: 如果在小级别下瓦片太大，该选项将自动简化要素；
- `--extend-zooms-if-still-dropping`: 如果在大级别下瓦片仍然很大，它将自动增加最大级别，以使最大级别下没有要素被删除；

### 连续的面要素（行政区划），在所有级别可见

```bash
curl -L -O https://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/cultural/ne_10m_admin_1_states_provinces.zip
unzip -o ne_10m_admin_1_states_provinces.zip
ogr2ogr -f GeoJSON ne_10m_admin_1_states_provinces.geojson ne_10m_admin_1_states_provinces.shp

tippecanoe -zg -o ne_10m_admin_1_states_provinces.mbtiles --coalesce-densest-as-needed --extend-zooms-if-still-dropping ne_10m_admin_1_states_provinces.geojson
```

- `-zg`: 自动选择最大级别；
- `--extend-zooms-if-still-dropping`: 如果在大级别下瓦片仍然很大，它将自动增加最大级别，以使最大级别下没有要素被删除；
- `--coalesce-densest-as-needed`: 如果瓦片在低级别或中等级别下比较大，该选项将合并要素；

### 海量点数据（公交车GPS轨迹数据），可视化，在所有级别可见

```bash
curl -L -O ftp://avl-data.sfmta.com/avl_data/avl_raw/sfmtaAVLRawData01012013.csv
sed 's/PREDICTABLE.*/PREDICTABLE/' sfmtaAVLRawData01012013.csv > sfmta.csv
tippecanoe -zg -o sfmta.mbtiles --drop-densest-as-needed --extend-zooms-if-still-dropping sfmta.csv
```

(`sed` 命令用于清除不必要的字段)

- `-zg`: 自动选择最大级别；
- `--drop-densest-as-needed`: 如果在小级别下瓦片太大，该选项将自动简化要素；
- `--extend-zooms-if-still-dropping`: 如果在大级别下瓦片仍然很大，它将自动增加最大级别，以使最大级别下没有要素被删除；

### 低级别显示国家边界，高级别显示州边界

```bash
curl -L -O https://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/cultural/ne_10m_admin_0_countries.zip
unzip ne_10m_admin_0_countries.zip
ogr2ogr -f GeoJSON ne_10m_admin_0_countries.geojson ne_10m_admin_0_countries.shp

curl -L -O https://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/cultural/ne_10m_admin_1_states_provinces.zip
unzip -o ne_10m_admin_1_states_provinces.zip
ogr2ogr -f GeoJSON ne_10m_admin_1_states_provinces.geojson ne_10m_admin_1_states_provinces.shp

tippecanoe -z3 -o countries-z3.mbtiles --coalesce-densest-as-needed ne_10m_admin_0_countries.geojson
tippecanoe -zg -Z4 -o states-Z4.mbtiles --coalesce-densest-as-needed --extend-zooms-if-still-dropping ne_10m_admin_1_states_provinces.geojson
tile-join -o states-countries.mbtiles countries-z3.mbtiles states-Z4.mbtiles
```

- Countries:
  - `-z3`: 最大切片级别为3，即只切 0 - 3 级别的瓦片；
  - `--coalesce-densest-as-needed`: 如果瓦片在低级别或中等级别下比较大，该选项将合并要素；
- States and Provinces:
  - `-Z4`: 最小切片级别为4；
  - `-zg`: 自动选择最大级别；
  - `--coalesce-densest-as-needed`: 如果瓦片在低级别或中等级别下比较大，该选项将合并要素；
  - `--extend-zooms-if-still-dropping`: 如果在大级别下瓦片仍然很大，它将自动增加最大级别，以使最大级别下没有要素被删除；

### 多个数据源切片为独立的图层

```bash
curl -L -O https://www2.census.gov/geo/tiger/TIGER2010/COUNTY/2010/tl_2010_17_county10.zip
unzip tl_2010_17_county10.zip
ogr2ogr -f GeoJSON tl_2010_17_county10.geojson tl_2010_17_county10.shp

curl -L -O https://www2.census.gov/geo/tiger/TIGER2010/COUNTY/2010/tl_2010_18_county10.zip
unzip tl_2010_18_county10.zip
ogr2ogr -f GeoJSON tl_2010_18_county10.geojson tl_2010_18_county10.shp

tippecanoe -zg -o counties-separate.mbtiles --coalesce-densest-as-needed --extend-zooms-if-still-dropping tl_2010_17_county10.geojson tl_2010_18_county10.geojson
```

- `-zg`: 自动选择最大级别；
- `--coalesce-densest-as-needed`: 如果瓦片在低级别或中等级别下比较大，该选项将合并要素；
- `--extend-zooms-if-still-dropping`: 如果在大级别下瓦片仍然很大，它将自动增加最大级别，以使最大级别下没有要素被删除；

### 多个数据源切片并合并为一个图层

```bash
curl -L -O https://www2.census.gov/geo/tiger/TIGER2010/COUNTY/2010/tl_2010_17_county10.zip
unzip tl_2010_17_county10.zip
ogr2ogr -f GeoJSON tl_2010_17_county10.geojson tl_2010_17_county10.shp

curl -L -O https://www2.census.gov/geo/tiger/TIGER2010/COUNTY/2010/tl_2010_18_county10.zip
unzip tl_2010_18_county10.zip
ogr2ogr -f GeoJSON tl_2010_18_county10.geojson tl_2010_18_county10.shp

tippecanoe -zg -o counties-merged.mbtiles -l counties --coalesce-densest-as-needed --extend-zooms-if-still-dropping tl_2010_17_county10.geojson tl_2010_18_county10.geojson
```

- `-l counties`: 图层名默认为文件名，也可以使用该选项自定义；

## tile-join

用于合并或复制矢量瓦片。

## tippecanoe-decode

用于将矢量瓦片逆向转换为 GeoJSON。

## tippecanoe-enumerate

用于列举mbtiles中的矢量瓦片。