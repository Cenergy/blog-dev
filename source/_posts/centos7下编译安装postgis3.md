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

但看到，最好是下面的的版本

![image-20200612124515120](centos7%E4%B8%8B%E7%BC%96%E8%AF%91%E5%AE%89%E8%A3%85postgis3/image-20200612124515120.png)

本文基于GEOS3.8.1,GDAL2.4.4,Proj5.2.0,JSON0.13

```shell
wget https://download.osgeo.org/geos/geos-3.8.1.tar.bz2
```

:blush:  安装proj-6.3.2时，遇到

![image-20200613092144891](centos7%E4%B8%8B%E7%BC%96%E8%AF%91%E5%AE%89%E8%A3%85postgis3/image-20200613092144891.png)

然后我在命令行输入sqlite3的时候，结果是3.22，哪来的3.7.17？

https://stackoverflow.com/questions/62154342/configure-error-package-requirements-sqlite3-3-7-4-were-not-met

![image-20200613092614714](centos7%E4%B8%8B%E7%BC%96%E8%AF%91%E5%AE%89%E8%A3%85postgis3/image-20200613092614714.png)

原来是sqlite-devel的版本，但我查询之后是最新的！！于是我删了sqlite-devl，得到的是`Checking for module 'sqlite3' No package 'sqlite3' found`

暴力升级也没有用，不得不看日志的下半部分。于是搜索关键词`PKG_CONFIG_PATH`。找到https://my.oschina.net/zzop/blog/499908这篇文章，其中说到：

![image-20200613093520041](centos7%E4%B8%8B%E7%BC%96%E8%AF%91%E5%AE%89%E8%A3%85postgis3/image-20200613093520041.png)

:point_right:

![image-20200613094337927](centos7%E4%B8%8B%E7%BC%96%E8%AF%91%E5%AE%89%E8%A3%85postgis3/image-20200613094337927.png)

`cp /usr/local/lib/pkgconfig/sqlite3.pc /usr/lib64/pkgconfig/`

重新编译就好了！

![image-20200613095115674](centos7%E4%B8%8B%E7%BC%96%E8%AF%91%E5%AE%89%E8%A3%85postgis3/image-20200613095115674.png)

```shell
bash ./configure --prefix=/usr/local/gdal-3.0.4 --with-proj=/usr/local/proj-6.3.2 --with-geos=/usr/local/geos-3.8.1/bin/geos-config --with-sqlite3=/usr/local/bin/sqlite3 --with-libjson-c=/usr/local/json-c-0.13.1 --with-pg=/opt/pg12/bin/pg_config 
```

