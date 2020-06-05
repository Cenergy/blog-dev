---
title: centos7下编译安装postgis3
abbrlink: a70e035f
date: 2020-06-05 09:02:55
tags:
---

<!--more-->

本文认为已安装PostgreSQL，安装步骤如 [Centos7安装PostgreSQL](https://www.jianshu.com/p/639ebb43bfb4)，最好按照前文先把pg安装好，否则，在postgis,pgrouting安装时，指定pg的安装目录，直接抄路径应该不对，读者要指向自己的安装位置等。

CGAL4-11。因为4-11需要CMake3.11以上

```shell
cmake -version
# cmake version 2.8.12.2
```

升级cmake

```shell
 wget https://github.com/Kitware/CMake/releases/download/v3.16.8/cmake-3.16.8.tar.gz
 tar -zxvf cmake-3.16.8.tar.gz
 cd cmake-3.16.8
 ./bootstrap --prefix=/usr/local/cmake
 gamke
 gmake install
```

`postgis`还有安装其他依赖，可是不知道它的版本号，比如`GEOS`,`proj`,`GDAL`，于是打开window版的`PostGIS`的网页

https://postgis.net/windows_downloads/  ，在左侧发现一点端倪！

![image-20200605092404004](centos7%E4%B8%8B%E7%BC%96%E8%AF%91%E5%AE%89%E8%A3%85postgis3/image-20200605092404004.png)

于是我就想，按照这个版本安装，应该没错！

本文基于GEOS3.8.1,GDAL2.4.4,Proj5.2.0,JSON0.13

```shell
wget https://download.osgeo.org/geos/geos-3.8.1.tar.bz2
```

