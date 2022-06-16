---
title: 在 Fluid 主题中加入谷歌广告
index_img: >-
  https://rmt.dogedoge.com/fetch/fluid/storage/fluid-adsense/cover.png?w=480&fmt=webp
categories: 功能增强
tags:
  - Fluid
  - 花里胡哨
  - 转载
excerpt: 几行代码把自己博客的流量轻松变现
abbrlink: 8dc07bec
date: 2022-02-20 20:22:02
---

{% note success %}
本文由 Fluid 用户授权转载，版权归原作者所有。

本文作者：张凯强

原文地址：https://hexo.fluid-dev.com/posts/fluid-adsense/
{% endnote %}

大家写博客都想给自己提供一些回报，挂 CRM 广告是最方便的方式之一 ，而[谷歌广告](https://www.google.com/adsense)在所有 CRM 计费广告中是单价比较高的，不过就是提现比较麻烦，所以用之前最好先了解下，另外建议大家在博客有固定的流量后再加入广告，不然广告都是给自己看，可能会被谷歌判断刷量（谷歌对广告的规范很严格，放置过多的广告或者有诱导点击行为都是违规的）。

本文提供的方式需要 Fluid v1.9.0 以上版本。

然后在博客根目录下找到 `script` 文件夹（不存在就创建一个），进入后任意创建一个 js 文件，比如 `inject.js`，复制以下内容：

```javascript
hexo.extend.filter.register('theme_inject', function(injects) {
	injects.bodyEnd.raw('adsense', '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxx" crossorigin="anonymous"></script>');
	injects.head.raw('adsense', '<style>ins.adsbygoogle[data-ad-status="unfilled"] { display: none !important; }</style>');
	injects.postLeft.raw('adsense', '<aside class="sidebar d-none d-xl-block" style="margin-right:-1rem;z-index:-1"><ins class="adsbygoogle" style="display:flex;justify-content:center;min-width:160px;max-width:300px;width:100%;height:600px;position:sticky;top:2rem" data-ad-client="ca-pub-xxxxxx" data-ad-slot="yyyyyy"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({}); </script></aside>');
	injects.postCopyright.raw('adsense', '<div style="width:100%;display:flex;justify-content:center;margin-bottom:1.5rem"><ins class="adsbygoogle" style="display:flex;justify-content:center;max-width:845px;width:100%;height:90px" data-ad-client="ca-pub-xxxxxx" data-ad-slot="yyyyyy"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({}); </script></div>');
});
```

以上代码的意思请参考 [Fluid 注入功能](https://hexo.fluid-dev.com/docs/advance/#fluid-%E6%B3%A8%E5%85%A5%E4%BB%A3%E7%A0%81)，插入的广告位置和本页是一样的，分别是文章页的左侧和文末位置。

复制之后，把其中 `ca-pub-xxxxxx` 和 `data-ad-slot="yyyyyy"` 按谷歌广告里提供的编号替换即可。

保存后就不需要其他额外的配置了，如果谷歌广告的配置没有问题的话，部署之后应该就能看到广告展示出来。
