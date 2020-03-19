## 安装Linux系统
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
### Linux请求
- `curl -v https://v.qq.com/`
### Nginx
参考：
- [安装Nginx](https://www.runoob.com/linux/nginx-install-setup.html)
- [慕课网-Node部署](https://www.imooc.com/read/26/article/235)
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
#### 反向代理



## Linux 基础
- 使用`ssh root@xx.xx.xx.xx`回车输入密码
- 公钥
生成公钥：ssh-keygen -t rsa -P ''
- 查看公钥 
cat xx公钥文件
使用公钥，可以进行免密登录，比如github就可以使用ssh 进行免密登录推送代码等

## 常用命令
``` 
cp xx          //拷贝文件
cd             //进入目录
ls             //显示目录下文件
mkdir xx       //创建目录
cat xxx.md     //查看
tail xx.md     //尾查看
tail -f xx.md  //一直在尾部查看 查看日志常用
vi xx.md       //编辑
:q             //退出编辑
pwd            //查看当前所在路径
rm xxx         //删除
```
- vi & vim 编辑器
  - :wq //保存并退出
  - :q  //退出
  - :w  //保存 
  - :q! //强制退出