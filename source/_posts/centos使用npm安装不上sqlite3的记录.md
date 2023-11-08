---
title: centos使用npm安装不上sqlite3的记录
index_img: https://api.gishai.top/media/images/webp/default_banner.webp
abbrlink: f16721cc
date: 2023-11-08 14:34:33
tags:
---

在centos跑一个node服务时，npm或者yarn安装sqlite3无法成功的问题。一度怀疑是我的node版本太高了，想卸载安装低版本的node。谷歌问题搜索到以下答案。

![image-20231108144002203](centos%E4%BD%BF%E7%94%A8npm%E5%AE%89%E8%A3%85%E4%B8%8D%E4%B8%8Asqlite3%E7%9A%84%E8%AE%B0%E5%BD%95/image-20231108144002203-9425604.png)

![image-20231108144214941](centos%E4%BD%BF%E7%94%A8npm%E5%AE%89%E8%A3%85%E4%B8%8D%E4%B8%8Asqlite3%E7%9A%84%E8%AE%B0%E5%BD%95/image-20231108144214941-9425739.png)

综上所述就是python版本指定问题。

然后我就百度npm怎么设置指定python

![image-20231108144333959](centos%E4%BD%BF%E7%94%A8npm%E5%AE%89%E8%A3%85%E4%B8%8D%E4%B8%8Asqlite3%E7%9A%84%E8%AE%B0%E5%BD%95/image-20231108144333959-9425817.png)

```shell
npm config set python /usr/bin/python3
npm config set python-version 3.8.5
npm config set python-path /usr/local/bin/python
```

设置完再npm i就一次性成功了。
