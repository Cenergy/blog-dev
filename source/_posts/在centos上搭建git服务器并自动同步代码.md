---
title: 在centos上搭建git服务器并自动同步代码
abbrlink: cc12ec28
date: 2020-03-22 13:41:32
tags: 建站
---

> 本篇内容用来讲述如何将 hexo 博客部署到腾讯云的服务器上。
> 只要通过三步即可成功部署：
>
> 1. 云服务器端 git 的配置
> 2. Nginx 的配置
> 3. 本地端 hexo 的设置更改



# 前言

2. # 2. 云服务器端配置 git

   1. 安装依赖库和编译工具

      - 安装依赖库：

        ```
        yum install curl-devel expat-devel gettext-devel openssl-devel zlib-devel
        ```

      - 安装编译工具：

        ```
        yum install gcc perl-ExtUtils-MakeMaker package
        ```

   2. 下载 git

      - 选择一个目录来存放下载下来的 git 安装包。这里选择了`/usr/local/src` 目录

        ```
        cd /usr/local/src
        ```

      - 到官网找一个新版稳定的源码包下载到 `/usr/local/src` 文件夹里

        ```
        wget https://www.kernel.org/pub/software/scm/git/git-2.16.2.tar.gz
        ```

   3. 解压编译 git

      - 在当前目录下解压 `git-2.16.2.tar.gz`

        ```
        tar -zvxf git-2.16.2.tar.gz
        ```

      - 进入 `git-2.16.2.tar.gz` 目录下

        ```
        cd git-2.16.2
        ```

      - 执行编译

        ```
        make all prefix=/usr/local/git
        ```

      - 安装 git 到 `/usr/local/git` 目录下

        ```
        make install prefix=/usr/local/git
        ```

   4. 配置 git 环境变量

      - 将 git 加入 PATH 目录中

        ```
        echo 'export PATH=$PATH:/usr/local/git/bin' >> /etc/bashrc
        ```

      - 使 git 环境变量生效

        ```
        source /etc/bashrc
        ```

   5. 查看 git 版本

      ```
      git --version
      ```

   如果此时能查看到 git 的版本号，说明我们已经安装成功了。

1. 创建 git 仓库，用于存放博客网站资源。

   在 `home/git` 的目录下，创建一个名为`hexoBlog`的裸仓库（bare repo）。

    如果没有 `home/git` 目录，需要先创建；然后修改目录的所有权和用户权限。

   ```shell
   mkdir /home/git/
   chown -R $USER:$USER /home/git/
   chmod -R 755 /home/git/
   ```

    然后，执行如下命令：

```shell
cd /home/git/
git init --bare hexoBlog.git
```



刚才这一步主要创建一个裸的 git 仓库。

1. 创建一个新的 git 钩子，用于自动部署。

   1. 在 `/home/git/aigisss.git` 下，有一个自动生成的 `hooks` 文件夹。我们需要在里边新建一个新的钩子文件 `post-receive`。

      ```shell
      vim /home/git/aigisss.git/hooks/post-receive
      ```

   2. 按 `i` 键进入文件的编辑模式，在该文件中添加两行代码（将下边的代码粘贴进去)，指定 Git 的工作树（源代码）和 Git 目录（配置文件等）

      ```shell
      #!/bin/bash
      git --work-tree=/home/web/aigisss --git-dir=/home/git/aigisss.git checkout -f
      ```

      然后，按 `Esc` 键退出编辑模式，输入`:wq` 保存退出。

   3. 修改文件权限，使得其可执行

      ```shell
      chmod +x /home/git/aigisss.git/hooks/post-receive
      ```

到这里，我们的 git 仓库算是完全搭建好了。下面进行 `Nginx `的配置。

# 3. 云服务器端配置 Nginx

1. 安装 Nginx

   ```
   yum install -y nginx
   ```

2. 启动 Nginx

   ```
   service nginx start
   ```

3. 测试 Nginx 服务器

   ```
   wget https://127.0.0.1
   ```

能够正常获取欢迎页面说明Nginx安装成功。

```
Connecting to 127.0.0.1:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 43704 (43K) [text/html]
Saving to: ‘index.html’

100%[=======================================>] 43,704      --.-K/s   in 0s

2018-03-09 23:04:09 (487 MB/s) - ‘index.html’ saved [43704/43704]
```



1. 测试网页是否能打开
   在浏览器中输入服务器 ip 地址，就是服务器的公网 ip。

2. 配置 `Nginx` 托管文件目录

   1. 接下来，创建 `/home/hexoBlog`目录，用于 `Nginx`托管。

      ```shell
      mkdir /home/web/aigisss/
      chown -R $USER:$USER /home/web/aigisss/
      chmod -R 755 /home/web/aigisss/
      ```

   2. 查看 `Nginx` 的默认配置的安装位置

      ```
      nginx -t
      ```

   3. 修改`Nginx`的默认配置，其中 `cd` 后边就是刚才查到的安装位置（每个人可能都不一样）

      ```shell
      vim /etc/nginx/nginx.conf
      ```

   4. 按方向键，找到如下位置

      ```
      server {
          listen 80 default_server;
          listen [::]:80 default_server;
          root /home/hexoBlog;    #需要修改
          
          server_name www.bujige.net; #需要修改
          
          # Load configuration files for the default server block.
          include /etc/nginx/default.d/*.conf;
          location / {
          }
          error_page 404 /404.html;
              location = /40x.html {
          }
      ```

      按`i`键进入插入模式，将其中的 root 值改为 `/home/hexoBlog` （刚才创建的托管仓库目录）。
      将 server_name 值改成你的域名。

   5. 重启 `Nginx` 服务

      ```
      service nginx restart
      ```

至此，服务器端配置就结束了。接下来，就剩下本地 `hexo` 的配置更改了。

# 4. 修改 hexo 站点配置文件 git 相关设置

1. 打开你本地的 hexo 博客所在文件，打开站点配置文件（不是主题配置文件），做以下修改。

   ```
   deploy:
       type: git
       repo: root@CVM 你的云服务器的IP地址:/home/git/hexoBlog
       branch: master
   ```

2. 在 hexo 目录下执行部署，试试看。

   ```
   cd 你的 hexo 目录
   hexo clean
   hexo generate
   hexo deploy
   ```

3. 打开你的公网 IP，看是不是已经部署成功了。

[![img](http://qncdn.bujige.net/images/hexoBlog-deployed-server-005.png)](http://qncdn.bujige.net/images/hexoBlog-deployed-server-005.png)

1. 最后一步，更改域名解析。这一步不再做介绍。

   ```
   cert --nginx --nginx-server-root=/usr/local/nginx/conf -d www.aigisss.com
   ```

   