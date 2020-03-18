### Linux请求
- `curl -v https://v.qq.com/`
### Nginx
参考：[慕课网-Node部署](https://www.imooc.com/read/26/article/235)
#### 静态服务
> 存放网站的静态资源（Node的static也可以）：图片 js css vue打包的dist文件
- 配置文件(nginx.conf)
```
server{
  listen: 80;//监听80端口
  server_name： xx.com;//当请求那个域名的时候 可以是二级域名
  location / { // 静态资源存放的位置
    root /root/source/dist   //文件目录地址
    index index.html index.htm // 请求自动索引
  }
}
```
- 常用命令
  1.nginx -t (查看配置文件是否生效)
  2. vi xx.js 编辑（学习vi/vim编辑器）

- vi & vim 编辑器
  - :wq //保存并退出
  - :q  //退出
  - :w  //保存 
  - :q! //强制退出
#### 反向代理