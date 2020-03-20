# 项目部署
[Node部署-慕课网](https://www.imooc.com/read/26/article/235)
## 如何构建一个高可用的node环境
**主要问题:**
- 故障恢复（自动重启）
- 多核利用
- 多进程共享端口
**解决：**
1. 使用cluster模块 ，Node 主进程挂掉之后启动子进程（重启），多核利用，端口共享。
2. 使用fork模式，利用child_process.fork子进程。

## 上传文件
- 远程连接工具Xshell、putty
1. scp xx.js root@xx.xx.xx.xx:/root/use/  
2. 使用git pull
3. 使用ftp/sftp/xftp工具
4. winSCP

## pm2
- 内建负载均衡（使用Node cluster集群模块、子进程、可以参考扑灵的《深入浅出Node.js》第九章）
- 线程守护，keep alive
- 0秒停机重启，维护升级的时候不需要停机
- 现在的Linux（stable)&MacOdx(stable)&windows(stable)多平台支持
- 停止不稳定的进程，（避免无限循环）
- 控制台检测
- 提供HTTP API
``` bash
npm install pm2
pm2 start xx.js
pm2 app.js -i max 
# 根据当前机器的CPU核数，开启当前机器的最大数目的进程
pm2 start app.js --watch -i 2 
# watch 监听文件变化 -i 启动多少个进程 
pm2 list
pm2 stop id&name
pm2 stop all
pm2 delete id&name
```
配置文件：
process.yml
``` yml
apps: 
    - script : app.js
      instances: 2
      watch  : true
      env    :
      NODE_ENV: production
```
启动配置文件：`pm2 start process.yml`
**部署taro-node**

## Nginx
- [安装Nginx](https://www.yiibai.com/nginx/nginx-install.html)
- [安装Nginx-菜鸟教程](https://www.runoob.com/linux/nginx-install-setup.html)    
- ![部署原理](https://github.com/AnsonZnl/PictureBed/blob/master/fe/Nginx3.png?raw=true)

### 静态服务
存放打包好的dist目录，默认的是80端口，请求的api被Nginx转发到node服务的3000端口

安装目录`/etc/nginx`
taro存放目录`/etc/nginx/setes-enabled/taro`

``` bash
#  Ubuntu apt是包管理工具类似npm 
sudo apt install yum #安装yum
sudo apt install nginx #安装Nginx
sudo cp -r /mnt/d/Github/KKB/Node/10部署/taro /etc/nginx/sites-enabled
# 把windows D盘下的文件拷贝到linux子系统上：（如果是在window上装虚拟机或者linux子系统，linux会挂载在/mnt上，在mnt里可以访问windows里的CDEF盘）
```
**配置文件**
``` yml
# /etc/nginx/sites-enable/taro
server {
    listen: 80; # 端口
    server_name: taro.jspdf.com; # 服务地址 域名 
    location / {
        root /root/source/taro/dist; #索引目录
        index index.html index.htm; #索引文件
    }
}
### 反向代理
- 正向代理（client）
- 反向代理（server）

把`/api/xx`都反向代理到Node的3000端口。
``` yml
# /etc/nginx/sites-enabled
# taro
server {
  listen: 80; #监听端口
  server_name: taro.josephcoa.com; # 服务地址
  location / {
    root /root/source/taro-node/dist; # 访问的根目录
    index index.html index.htm; # 索引文件
  }
  location ~ \.(gif|jpg|png)$ {
    root /root/source/taro-node/server/static # 静态资源存放目录
  }
  location /api {
    proxy_pass http://127.0.0.1:3000; # 请求api/接口时 转发到http://127.0.0.1:3000
    proxy_redirect    off;
    proxy_set_header  Host;            $host;
    proxy_set_header  X_Real_Ip        $remote_addr;
    proxy_set_header  X_Forwarded_For  $proxy_add_x_forwarded_for;
  }
}

```
- 查看配置文件是否生效`nginx -t`
- 重启`service nginx restart` 或者 `nginx -s reload`

## docker
### 安装
- 自建服务器，安装Ubantu 或者 CenteOS
- 虚拟机 vbox
- mac docker / unix apt brew(mac本身是基于Unix)
- win10
  - vbox - linux
  - linux 子系统（也可以装docker）
  - docker
    - 专业版
    - 普通版
      - vbox
      - docker + vbox
### 参考文档
- [视频地址](https://www.bilibili.com/video/av71365439?p=25)
- [阮一峰-Docker入门教程](http://www.ruanyifeng.com/blog/2018/02/docker-tutorial.html)
### 三个核心概念
- 镜像（拉取需要的镜像 如Nginx）
- 容器（运行实例）
- 仓库

**本地装有点多此一举，后续可以在服务器上实验，暂时用不到，**

### docker-compose
- 多个docker集群

### git自动部署
- github webhook
- 监听push操作
- push后自动更新重启

### 总结
- 掌握pm2部署Node.js服务
  -了解cluster原理

- Nginx
  - 静态资源 location
  - 动态数据请求proxy
  - 负载均衡

- docker
  - docker-compose
  - git自动化部署 CI

### 学原理，不做API工程师
**命令多不怕可以查，重要的是把思路听明白，逻辑关系理清楚**