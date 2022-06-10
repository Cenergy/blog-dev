---
title: centos7.7下安装postgresql12.3
abbrlink: 27e03ac5
date: 2020-05-26 09:12:24
tags: Postgres
---
##  安装依赖

```shell
yum install -y readline-devel zlib-devel make gcc
```

##  创建用户组和用户、密码

```shell
groupadd -g 1000 postgres
useradd -g 1000 -u 1000 postgres
passwd postgres
```
<!--more-->

<div class="danger">安装完才发现有更简单的方法！</div>

打开`postgresql`的官网安装教程：https://www.postgresql.org/download/linux/redhat/ ，选择一下系统

![image-20200619125645752](centos7%E4%B8%8B%E5%AE%89%E8%A3%85postgresql12/image-20200619125645752.png)

就会发现安装如下的命令行：

```shell
yum install https://download.postgresql.org/pub/repos/yum/reporpms/EL-7-x86_64/pgdg-redhat-repo-latest.noarch.rpm
yum install postgresql12-server
/usr/pgsql-12/bin/postgresql-12-setup initdb
systemctl enable postgresql-12
systemctl start postgresql-12
```



## 安装前准备

```shell
mkdir -p /opt/pg12/{data,backup,scripts,archive_wals}
chown -R postgres.postgres /opt/pg12/
chmod 0700 /opt/pg12/data
```

## 解压编译安装

```shell
tar -zxvf postgresql-12.3.tar.gz 
./configure  --prefix=/opt/pg12 --with-pgport=5432
gmake world
gmake install-world
```

## 配置环境变量

```shell
# 切换到postgres账户
su - postgres
# 编辑用户下配置文件
vim /home/postgres/.bashrc
```

编辑内容如下:

```shell
PG_HOME=/opt/pg12/

LD_LIBRARY_PATH=$PG_HOME/lib:$LD_LIBRARY_PATH
PATH=$PG_HOME/bin:$PATH

PKG_CONFIG_PATH=$PG_HOME/lib/pkgconfig:$PKG_CONFIG_PATH
export PKG_CONFIG_PATH LD_LIBRARY_PATH
```

`source /etc/profile` 更新配置！

##  初始化数据库

```shell
#在postgres账户下执行
/opt/pg12/bin/initdb -D /opt/pg12/data/ -W
/opt/pg12/bin/pg_ctl -D /opt/pg12/data/ -l logfile start
```

##  启动数据库

```shell
pg_ctl start -D $PGDATA
```

##  设置监听

修改`postgres/data`目录下的`pg_hba.conf`

```shell
vim $PGDATA/pg_hba.conf
```

修改`IPv4`一行内容如下:

```bash
# IPv4 local connections:
host    all             all             0.0.0.0/0            trust
```

修改`postgresql.conf`：

```bash
vim $PGDATA/postgresql.conf
```

修改监听一节如下:

```bash
# - Connection Settings -
listen_addresses = '*' 
port = 5432 
```

`wq!`保存退出。
重启pg服务生效

```bash
pg_ctl restart -D $PGDATA
```

##  设置开机自启动

创建 `postgresql.service` 服务脚本

```bash
vim /usr/lib/systemd/system/postgresql.service
```

编辑内容如下:

```bash
[Unit]
Description=PostgreSQL database server
After=network.target

[Service]
Type=forking #服务的类型，常用的有 simple（默认类型） 和 forking。默认的 simple 类型可以适应于绝大多数的场景，因此一般可以忽略这个参数的配置。而如果服务程序启动后会通过 fork 系统调用创建子进程，然后关闭应用程序本身进程的情况，则应该将 Type 的值设置为 forking，否则 systemd 将不会跟踪子进程的行为，而认为服务已经退出。 pg需要通过fork来创建一些子进程，所以这里选择forKing

User=postgres
Group=postgres

# Port number for server to listen on
Environment=PGPORT=5432

# Location of database directory
Environment=PGDATA=/opt/pg12/data

# Where to send early-startup messages from the server (before the logging
# options of postgresql.conf take effect)
# This is normally controlled by the global default set by systemd
# StandardOutput=syslog

# Disable OOM kill on the postmaster
OOMScoreAdjust=-1000

#ExecStartPre=/opt/pg12/bin/postgresql-check-db-dir ${PGDATA}
ExecStart=/opt/pg12/bin/pg_ctl start -D ${PGDATA} -s -o "-p ${PGPORT}" -w -t 300
ExecStop=/opt/pg12/bin/pg_ctl stop -D ${PGDATA} -s -m fast
ExecReload=/opt/pg12/bin/pg_ctl reload -D ${PGDATA} -s

# Give a reasonable amount of time for the server to start up/shut down
TimeoutSec=300

[Install]
WantedBy=multi-user.target
```

如果之前使用`pg_ctl restart -D $PGDATA`启动过，先停止`pg_ctl stop -D $PGDATA`

更新设置:

```bash
systemctl daemon-reload
```

配置开机自启动:

```
systemctl enable pgserver.service
```

## 常用指令

启动服务

```bash
systemctl  start  postgresql.service
```

停止服务

```bash
systemctl stop postgresql.service
```

重启服务

```bash
systemctl restart postgresql.service
service postgresql restart
```

使服务自动启动

```bash
systemctl enable postgresql.service
```

使服务不自动启动

```bash
systemctl disable postgresql.service
```

检查服务状态

```bash
systemctl   status  postgresql.service
systemctl   is-active postgresql.service
```

显示所有已启动的服务

```bash
systemctl   list-units --type=service
```