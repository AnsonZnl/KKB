## MongoDB
> 非关系型数据库
## node连接MongoDB
参考：[菜鸟教程，node.js连接MongoDB](https://www.runoob.com/nodejs/nodejs-mongodb.html)
### 使用mongodb
- 安装mongodb包`npm install mongodb`
- package包的名字不可以和安装的包重名，比如我的包名是mongodb,那就不可以下载mongodb。
- 创建的mongodb的集合，会自动加s.
- 增删改查`insertOne updata findOne deleteOne`
- 实现一个todolist小demo
### 使用ODM模型mongoose
概述：优雅的NodeJS对象文档模型，object document model
两个特点：
- 用关系型数据库的思想来设计非关系型数据库
- 基于mongodb驱动，简化操作
- 安装`npm install mongoose -S`

## KeyStoneJS & puppeteer
目标-敏捷的全栈
- KeyStoneJS——快速快速开发建站利器，安装自带基础模板，只需创建表模型，定义数据结构，自动带CRUD产生，基于mongoose，方便二次开发，快速开发网站推荐。
- [快速上手](https://www.keystonejs.com/quick-start/)
- https://www.jianshu.com/p/13009a20aa80?nomobile=yes
- puppeteer：https://github.com/AnsonZnl/imooc-data-analysis


## 作业
- 复习现有功能，基本
- DeleteFlg实现 中等
- 定义模型后生成的CRUD(增删改查)界面包括有效性检测 高
- 老师代码地址：https://github.com/AnsonZnl/kaikeba-code
## 工作流程
- 正常开发
原型-ER->（数据库建表字段等）->具体的程序
原型->模型->域模型->程序
- KeyStoneJS-敏捷开发
模型 -> 域模型（字段）-> CURD -> 后台的管理 -> RESTful接口
PM -> 定义模型字段-> 自动*CURD -> *自动*后台的管理 -> *自动*RESTful接口
