---
title: 使用hexo过程中遇到的错误记录
abbrlink: 326cb881
date: 2019-09-09 09:58:21
mathjax: true
tags:
  - Hexo
  - NexT
categories: 技术
---

{% note danger %}

遇到hexo编译之后发布不成功，报`Permission denied`的错!

```sh
Permission denied (publickey).
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
FATAL Something's wrong. Maybe you can find the solution here: http://hexo.io/docs/troubleshooting.html
```

解决方法：

使用git bash解决了，会弹出密码输入框，填入就好了！

参考文章：https://blog.csdn.net/dingding_12345/article/details/69666233

![image-20200618100855896](%E4%BD%BF%E7%94%A8hexo%E4%B8%8Bnext%E4%B8%BB%E9%A2%98%E6%97%B6%E5%87%BA%E9%94%99/image-20200618100855896.png)

又遇到`RPC failed; curl 56 OpenSSL SSL_read: SSL_ERROR_SYSCALL, errno 10054`的错：

```sh
Error: fatal: the remote end hung up unexpectedly
fatal: the remote end hung up unexpectedly
error: RPC failed; curl 56 OpenSSL SSL_read: SSL_ERROR_SYSCALL, errno 10054
```

```Shell
git config http.postBuffer 524288000
```



在主题下的`_config.yml`文件中设置：

#### 使用了 hexo-asset-image 和 hexo-abbrlink 后，图片显示不出来。

issue：https://github.com/rozbo/hexo-abbrlink/issues/19

解决方法：https://github.com/foreveryang321/hexo-asset-image

{% endnote %}

![](使用hexo下next主题时出错/QQ%E5%9B%BE%E7%89%8720190911114226.png)
