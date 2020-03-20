## 安装Linux系统
- 购买云服务器，系统使用Ubantu 或者 CenteOS
- Mac(Mac本身是基于Unix)
- Windows
  - vbox(虚拟机) - linux
  - linux 子系统（也可以装docker）

## Linux 基础
- 使用`ssh root@xx.xx.xx.xx`回车输入密码
- 公钥
生成公钥：ssh-keygen -t rsa -P ''
- 查看公钥 
cat xx公钥文件
使用公钥，可以进行免密登录，比如github就可以使用ssh 进行免密登录推送代码等

## 常用命令
``` bash
curl -v https://v.qq.com/ # 向目标网址发送一个http请求
cp xx xx       # 拷贝文件 从xx路径拷贝到xx路径下 cp -r xx xx拷贝目录
cd             # 进入目录
ls             # 显示目录下文件
mkdir xx       # 创建目录
cat xxx.md     # 查看
tail xx.md     # 尾查看
tail -f xx.md  # 一直在尾部查看 查看日志常用
vi xx.md       # 编辑
:q             # 退出编辑
pwd            # 查看当前所在路径
rm xxx         # 删除
#  Ubuntu apt是包管理工具类似 npm 
sudo apt install yum #安装yum
sudo apt install nginx #安装Nginx
sudo cp -r /mnt/d/Github/KKB/Node/10部署/taro /etc/nginx/sites-enabled
# 把windows D盘下的文件拷贝到linux子系统上：（如果是在window上装虚拟机或者linux子系统，linux会挂载在/mnt上，在mnt里可以访问windows里的CDEF盘）
```

### vi 编辑器
``` bash
- vi & vim 编辑器
  - vi xx # 进入编辑模式
  - :wq # 保存并退出
  - :q  # 退出
  - :w  # 保存 
  - :q! # 强制退出
```