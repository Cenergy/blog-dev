---
title: supervisor的使用记录
index_img: /posts/8479a1a4/supervisor.jpg
abbrlink: 8479a1a4
date: 2021-06-12 16:08:44
tags: Supervisor
---

## 前言

为啥使用supervisor，因为最近给我的[API服务](https://api.aigisss.com/)增加了一个定时任务，需要后台一直运行一条命令行，当关掉这个命令行时任务就不会跑了，各种搜索，定位到supervisor能解决这个问题。于是了解了一下，发现Supervisor还能解决Django项目不能自动启动的问题。Supervisor是用Python开发的一套通用的进程管理程序，能将一个普通的命令行进程变为后台daemon，并监控进程状态，异常退出时能自动重启。它是通过fork/exec的方式把这些被管理的进程当作supervisor的子进程来启动，这样只要在supervisor的配置文件中，把要管理的进程的可执行文件的路径写进去即可。也实现当子进程挂掉的时候，父进程可以准确获取子进程挂掉的信息的，可以选择是否自己启动和报警。supervisor还提供了一个功能，可以为supervisord或者每个子进程，设置一个非root的user，这个user就可以管理它对应的进程。

## supervisor安装
centos7 系统yum安装的supervisor是3.*.*版本，需要使用python的pip安装最新版本(4.2.3)
```bash
pip3 install supervisor
```
由于本机python是编译安装，所以supervisor安装后所在目录为:
```bash
/usr/local/python3/bin/supervisorctl  (客户端（用于和守护进程通信，发送管理进程的指令）)
/usr/local/python3/bin/supervisord  (是supervisor的守护进程服务（用于接收进程管理命令))
/usr/local/python3/bin/echo_supervisord_conf (生成初始配置文件程序)
```
然后要将这个路径添加到环境变量中
```bash
将 PATH=$PATH:$HOME/bin:/usr/local/python3/bin
添加到用户目录文件 .bash_profile 里面, 其他能够执行环境变量初始化的文件也可以。
```
## 配置supervisor
```shell
mkdir -p /etc/supervisor/conf.d/
echo_supervisord_conf > /etc/supervisor/supervisord.conf
```
在/etc/supervisor/supervisord.conf 的[include]下添加:
```shell
;[include]
;files = relative/directory/*.ini
# 修改为:
[include]
files = /etc/supervisor/conf.d/*.conf
# (注意去掉分号,第一次安装的时候就因为没去掉分号出现了问题!);
```
## 配置开机自启动

### 官方脚本
```bash
wget -O /usr/lib/systemd/system/supervisord.service  https://github.com/Supervisor/initscripts/raw/master/centos-systemd-etcs
```
### 手动编写

```bash
# supervisord service for systemd (CentOS 7.0+)
[Unit]
Description=Supervisor daemon
After=network.target

[Service]
Type=forking
# 第一个参数必须是可执行文件的绝对路径，不接受替代
ExecStart=/usr/local/python3/bin/supervisord -c /etc/supervisor/supervisord.conf
ExecStop=/usr/local/python3/bin/supervisorctl $OPTIONS shutdown
ExecReload=/usr/local/python3/bin/supervisorctl $OPTIONS reload
KillMode=process
Restart=on-failure
RestartSec=42s

[Install]
WantedBy=multi-user.target
```
### 设置开机启动
```bash
systemctl enable supervisord.service
systemctl daemon-reload 
systemctl list-unit-files|grep enabled #查看是否开启成功

chmod 766 supervisord.service # 修改文件权限
```

### 编辑监控程序文件
在/etc/supervisor/conf.d 下新建程序文件，比如cmd.conf
```bash
[program:somecmd]
command=/usr/local/python3/bin/python cmd.py
numprocs=1
autostart=true
autorestart=true
startretries=3
user=nfuser
redirect_stderr=true
stdout_logfile=/var/log/cmd-stdout.log
stdout_logfile_maxbytes=10MB
stdout_logfile_backups=20
```
如果有多个程序，可以配置为组:
```bash
; The below sample group section shows all possible group values,
; create one or more 'real' group: sections to create "heterogeneous"
; process groups.

;[group:thegroupname]
;programs=php-fpm,nginx,redis,mysql  ; 定义该组有哪些程序，程序之间用逗号分隔，注意，这些程序必须在前面用“[program:theprogramname]”模块定义过。
;priority=999                        ; 启动优先级，假设有多个组，每个组一个优先级，越小越优先执行 (默认 999)
```
## 启动supervisor
### 手动启动supervisor
```shell
supervisord -c /etc/supervisor/supervisord.conf
ps -ef | grep supervisord # 查看服务是否已启动
cat /var/log/cmd-stdout.log # 通过日志查看
```
### 通过systemd命令启动
```shell
systemctl status supervisord # 查看supervisord状态
systemctl start supervisord
systemctl restart supervisord
systemctl stop supervisord
```
### 修改cmd配置文件后重新载入
```bash
supervisorctl reread
supervisorctl update
supervisorctl restart somecmd

```
### 修改/etc/supervisor/supervisord.conf后重新载入
```shell
supervisorctl reload
```
### 一些其他可能用到的命令
```shell
supervisorctl start programname      启动某个进程  
supervisorctl stop programname       停止某个进程
supervisorctl restart programname    重启某个进程
supervisorctl start all     启动全部进程
supervisorctl stop all      停止全部进程，注：start、restart、stop都不会载入最新的配置文件。
supervisorctl status        查看状态
supervisorctl shutdown      关闭supervisor
```

## 示例

### Django+uWsgi+supervisor

- uWsgi配置

```sh
[uwsgi]
# Django-related settings
#uwsgi 备注
# start ===> uwsgi --ini /hainergy/script/uwsgi.ini
# reload ===> uwsgi --reload /hainergy/pidfile/uwsgi.pid
# stop ===> uwsgi --stop /hainergy/pidfile/uwsgi.pid

# the base directory (full path)
home = /root/.virtualenvs/py38
chdir = /home/web/dogdog
module = dogdog.wsgi:application
# master
master = True
pidfile=/hainergy/pidfile/uwsgi.pid
# daemonize = /hainergy/log/uwsgi.log
# logto = /hainergy/log/uwsgi.log
# maximum number of worker processes
processes = 10
# the socket (use the full path to be safe)
socket = 127.0.0.1:9999         # 云服务器内部ip
uid = root
gid = root
workers = 1
reload-mercy = 10
# clear environment on exit
vacuum = True
max-requests = 1000
# max virtual
limit-as = 1024   
reload-on-as =1024
buffer-size = 30000
#py-autoreload=1
```

- nginx

```ini
location /static{
  alias /home/web/doggo/static;
}	

location /media {
  alias /home/web/doggo/media;
}

location / {
  include /usr/local/nginx/conf/uwsgi_params;
  uwsgi_pass 127.0.0.1:9999;
  # index  templates/talk.html talk.htm;
}
```

- supervisor

```ini
[program:djangogo]
command=/usr/local/python3/bin/uwsgi --ini /hainergy/script/uwsgi.ini
user=root
autorestart=true
autostart=true
startretries=3
redirect_stderr=true
startsecs=5
stdout_logfile=/hainergy/log/aigisss.log
stopasgroup=true
killasgroup=true
priority=999
```

### Django+django_q

- supervisor 

```ini
[program:qcluster]
directory=/home/web/doggo
command=/root/.virtualenvs/aigisss_py/bin/python manage.py qcluster
stopasgroup = true
user=root
stdout_logfile=/hainergy/log/qcluster.log
```

### node+supercisor

- supervisor

```ini
[program:tilemap]
directory=/home/server/mbserver
command=/usr/local/nodejs/bin/pm2 start app.js
user=root
autorestart=true
autostart=true
startretries=3
redirect_stderr=true
startsecs=5
stdout_logfile=/hainergy/log/tilemap.log
stopasgroup=true
killasgroup=true
priority=999
```

