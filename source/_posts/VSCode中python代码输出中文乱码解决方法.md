---
title: VSCode中python代码输出中文乱码解决方法
abbrlink: 87ed0839
date: 2019-09-12 10:10:35
tags: [python,vscode]
categories: 技术
---

## 在 vscode 中编写 python 代码，输出中文时，控制台输出为乱码解决方法：

![1568254353802](VSCode%E4%B8%ADpython%E4%BB%A3%E7%A0%81%E8%BE%93%E5%87%BA%E4%B8%AD%E6%96%87%E4%B9%B1%E7%A0%81%E8%A7%A3%E5%86%B3%E6%96%B9%E6%B3%95/1568254353802.png)

<!--more-->

### 先检查右下角编码集设置是否正确

![1568254487426](VSCode%E4%B8%ADpython%E4%BB%A3%E7%A0%81%E8%BE%93%E5%87%BA%E4%B8%AD%E6%96%87%E4%B9%B1%E7%A0%81%E8%A7%A3%E5%86%B3%E6%96%B9%E6%B3%95/1568254487426.png)

### 修改完后运行仍不行，可以在"文件"－"首选项"－"用户设置"中搜索 code-runner.executorMap 选项，提示需要在 setting.json 中修改

![1568254594172](VSCode%E4%B8%ADpython%E4%BB%A3%E7%A0%81%E8%BE%93%E5%87%BA%E4%B8%AD%E6%96%87%E4%B9%B1%E7%A0%81%E8%A7%A3%E5%86%B3%E6%96%B9%E6%B3%95/1568254594172.png)

在 json 中添加下列属性

```json
"code-runner.executorMap": {
"python": "set PYTHONIOENCODING=utf8 && python -u"
}
```
<div class="note default">
https://mp.weixin.qq.com/s/QIJ-QHkxZUyKyQAPG49vPg
</div>

