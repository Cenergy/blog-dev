---
title: 重新编译nginx添加新模块的方法
index_img: 'https://www.aigisss.com/static/images/bg.jpg'
abbrlink: 2b8963ab
categories: 未分类
date: 2020-07-20 23:58:09
tags: nginx
---

111

因为使用`gzip`压缩时,我将`gzip_static`开启,结果出错了.

```shell
nginx: [emerg] unknown directive "gzip_static"
```

说是没有安装这个模块,但是我已经安装了!!

下面讲解如何在已经安装过后再次添加新的模块。

因为源码已经删掉了,重新下载一份

## 下载并解压

```shell
wget http://nginx.org/download/nginx-1.18.0.tar.gz
tar -xzvf nginx-1.18.0.tar.gz
cd nginx-1.18.0
```

## 重新编译

```shell
./configure --prefix=/usr/local/nginx --with-http_ssl_module  --with-http_gzip_static_module
```

## 执行make

> 千万别执行`make install`

`make`完之后在当前目录下的`/objs`目录下就多了个`nginx`，这个就是新版本的程序了。

## 备份

以防万一,备份旧的程序

```shell
cd /usr/local/nginx/sbin/
mv nginx nginx_bak
```

## 移植

将新的`nginx`程序复制到`/usr/local/nginx/sbin/`下

```shell
cp /home/download/softwares/nginx-1.18.0/objs/nginx /usr/local/nginx/sbin/
```

## 测试

```shell
/usr/local/nginx/sbin/nginx  -V
## 结果如下
nginx version: nginx/1.18.0
built by gcc 4.8.5 20150623 (Red Hat 4.8.5-39) (GCC) 
built with OpenSSL 1.0.2k-fips  26 Jan 2017
TLS SNI support enabled
configure arguments: --prefix=/usr/local/nginx --with-http_ssl_module --with-http_gzip_static_module
```

## 平滑启动

```shell
## 测试语法的正确性
/usr/local/nginx/sbin/nginx -t
nginx: the configuration file /usr/local/nginx/conf/nginx.conf syntax is ok
nginx: configuration file /usr/local/nginx/conf/nginx.conf test is successful
## 启动
/usr/local/nginx/sbin/nginx -s reload
```

