---
title: arcgis server站点服务的的迁移与恢复
index_img: /images/cover/2.png
abbrlink: 3cb1af17
date: 2024-05-26 10:19:56
tags:
---

{% note success %}
本文转载，版权归原作者所有。

本文作者：GIS学习小屋
原文地址：https://mp.weixin.qq.com/s/eEExwtgIoot2cdu9jKZHkw
{% endnote %}

​        通常我们会遇到因为服务器问题或者ArcGIS Server站点异常需要对服务整体迁移的情况，如果重新发布所有服务耗时耗力，在这种情况下我们可以采用迁移的方式来恢复站点。以下方案适用于在同一台机器迁移或者从A机器迁移至B机器。

方式一：通过手动拷贝文件夹替换的方式迁移

情景1：保持config-store和directories物理路径相同、迁移前后的arcgis server account用户名和密码保持一致、数据源的存储位置不变。这种是最为简单的迁移模式，具体步骤如下：

1、先手动备份下原始环境里arcgisserver整个文件夹

2、在新的机器上安装server ，或者在原有机器上将 server卸载掉然后安装 arcgis server，并且创建空站点，确保config-store和directories物理路径和原始站点相同

3、停止新环境server的系统服务，将步骤1备份文件夹里的config-store下services、data和directories 目录拷贝到新创建的site对应的目录下，覆盖对应目录。

4、拷贝过来的arcgisserver目录，由于拷贝丢失了相关的权限信息。在文件夹属性的安全中，赋予server 账户的完全控制权限。

5、 启动server系统服务。

情景2：config-store和directories物理路径不一致，arcgis server account用户名和密码一致、数据源的存储位置不变的情况。

1、先按照上述情景1的步骤进行操作

2、操作完成后，先停止server系统服务，需要找到服务的配置文件，修改msd的路径指向新的路径。

(1) 路径1：在arcgisinput文件夹对应服务目录下的manifest.json和manifest.xml文件（如arcgisinput\服务名称.MapServer\extracted\）

(2) 路径2：在config-store的services目录中找到对应的服务目录，修改服务名对应的json文件中的相对应路径(config-store\services\服务名.MapServer\服务名.MapServer.json），高版本的server不需要修改此文件。

3、启动server系统服务。

情景3：上面的情景中都是数据源不变的情况，但是在实际的情况下，有可能出现数据源发生变化的情况，如：

1、如果发布服务的时候数据存储在filegdb中，现数据存储转存到共享存储中；

(1) 先按照上述情景1的步骤进行操作

(2) 停止server服务，将新的共享文件夹注册到server注册，然后需要修复server端的mxd文档中数据源的路径指向新路径，再通过新的mxd生成新的msd文件，覆盖替换v101文件夹下的mxd及msd文件。具体路径为

`arcgisserver\directories\arcgissystem\arcgisinput\xxx.MapServer\extracted\v101`

生成msd方法有：

a、https://blog.csdn.net/smss007/article/details/82993749

b、arcpy脚本生成

(3) 启动server系统服务

2、如果更改了server中的服务的数据源的连接字符串(数据库的用户名，密码或者ip发生了变化)，导致通过注册到server的旧的sde连接字符串没有办法访问新的数据库。

(1) server 10.4.1之后的版本：

  a、先通过arcmap创建新的sde文件，确保Server也可以通过连接文件中的ip、端口和实例等信息访问到SDE库。

  b、其次，在manager中点击站点->数据存储，找到之前注册的sde连接的那个条目，点击右侧的编辑，导入步骤1中创建的sde文件。

(2) server 10.4.1之前的版本：

  a、先通过arcmap创建新的sde文件

  b、通过上述替换msd的方式。



方式二、使用server安装目录自带的备份还原工具来恢复站点。

备份工具详见：

https://enterprise.arcgis.com/zh-cn/server/10.8/administer/windows/backup-utility.htm

还原工具详见：

https://enterprise.arcgis.com/zh-cn/server/10.8/administer/windows/restore-utility.htm

详细说明见：

https://enterprise.arcgis.com/zh-cn/server/10.8/administer/windows/back-up-and-restore-your-arcgis-server-site-configuration.htm

具体步骤：

1、在新环境中安装ArcGIS Server，或者在原有环境中卸载server然后安装arcgis server。

2、在原环境中运行备份工具，备份文件存到指定目录，如以下示例放置于sbackup文件夹创建备份，生成一个.agssite文件：

```
<Python installation location>\python.exe "D:\Program Files\ArcGIS\Server\tools\admin\backup.py" -u siteadmin -p admin123 -s https://myserver:6443 -f "d:\sbackup"
```

3、安装server后，创建空站点，配置目录路径和原始站点保持一致。

4、将原环境上的.agssite文件拷贝至新机器，在新机器上运行还原工具：

```
<Python installation location>\python.exe "D:\Program Files\ArcGIS\Server\tools\admin\restore.py" -u siteadmin -p admin123 -s https://gisserver.domain.com:6443 -f d:\sbackup\datatest.agssite -r d:\sbackup
```

参数说明：

-u : 主站点管理员帐户

-p：站点用户的密码

-s:  站点的URL ：

https://gisserver.domain.com:6443  或 http://gisserver.domain.com:6080

-f : 需要存储的 .agssite 备份文件的绝对路径。ArcGIS Server 帐户必须具有从此位置的读取权限。

-r: 此实用程序生成的报告所在文件夹的路径。ArcGIS Server 帐户必须具有从此位置的读取权限。

5、将原机器的缓存切片文件夹手动拷贝至新站点对应的位置：

（arcgisserver\directories\ 下的整个 arcgiscache 目录）