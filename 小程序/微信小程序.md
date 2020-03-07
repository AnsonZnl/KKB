# 微信小程序

开课吧视频链接：https://www.bilibili.com/video/av71365439?p=40

微信小程序文档：https://developers.weixin.qq.com/miniprogram/dev/api/

## 小程序云开发

就是小程序背靠腾讯云，每个小程序送了一套环境，小程序可以直接调用这个腾讯云环境下的数据库（MongoDB）、文件存储（类七牛云）、云函数（Node后端）。

每次修改云函数都应点击右键点击“创建并部署”，否则该函数不生效。

### 云函数

> 云函数即在云端（服务器端）运行的函数。在物理设计上，一个云函数可由多个文件组成，占用一定量的 CPU 内存等计算资源；各云函数完全独立；可分别部署在不同的地区。开发者无需购买、搭建服务器，只需编写函数代码并部署到云端即可在小程序端调用，同时云函数之间也可互相调用。

其实云函数就是Node项目，可以做Node项目一切操作，比如安装依赖、编写爬虫等等，前端执行云函数，应使用:

```javascript
pages({
    cloudFun(){
        wx.cloud.callFunction({
            name:'cloudfunctionName',
            data:{des: '发送给函数的数据'},
            success:res=>{
              console.log(res)
            },
            fail: err=>{
			   console.log(err)
            }
    }
})
```

### 云数据库

> 云开发提供了一个 JSON 数据库，顾名思义，数据库中的每条记录都是一个 JSON 格式的对象。一个数据库可以有多个集合（相当于关系型数据中的表），集合可看做一个 JSON 数组，数组中的每个对象就是一条记录，记录的格式是 JSON 对象。
>
> 关系型数据库和 JSON 数据库的概念对应关系如下表：
>
> | 关系型          |      文档型       |
> | :-------------- | :---------------: |
> | 数据库 database |  数据库 database  |
> | 表 table        |  集合 collection  |
> | 行 row          | 记录 record / doc |
> | 列 column       |    字段 field     |

官方文档：[小程序-云开发-数据库]([https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/capabilities.html#%E6%95%B0%E6%8D%AE%E5%BA%93](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/capabilities.html#数据库))

小程序端操作数据的demo:

```javascript

const db = wx.cloud.database({
  env: '环境name'
});
pages({
  cloudDatabase(){
	 db.collection('dataName').get/add/where/delete({
	   data: 'str'
	 }).then(res=>{
	   console.log(res)
	 }).catch(err=>{
       console.log(err)
     })
    }
})
```

小程序云开发，没有请求，可直接读取数据库。

小程序云开发的数据，可以通过三种方式增删改查，分别是：

- 通过小程序
- 通过云函数
- 通过http请求（构建cms后台管理系统可用）

### 云存储

> 云存储提供高可用、高稳定、强安全的云端存储服务，支持任意数量和形式的非结构化数据存储，如视频和图片，并在控制台进行可视化管理。云存储包含以下功能：
>
> - 存储管理：支持文件夹，方便文件归类。支持文件的上传、删除、移动、下载、搜索等，并可以查看文件的详情信息
> - 权限设置：可以灵活设置哪些用户是否可以读写该文件夹中的文件，以保证业务的数据安全
> - 上传管理：在这里可以查看文件上传历史、进度及状态
> - 文件搜索：支持文件前缀名称及子目录文件的搜索
> - 组件支持：支持在 `image`、`audio` 等组件中传入云文件 ID

官方文档：[云储存](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/storage.html)

一个上传图片的demo：

```javascript

// 上传图片
  doUpload: function() {
    // 选择图片
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        wx.showLoading({
          title: '上传中',
        })
        const filePath = res.tempFilePaths[0]
        // 上传图片
        const cloudPath = 'my-image' + Math.random()*10000 + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)
            that.setData({
              imgSrc: res.fileID
              //在wxml中：<image src="{{imgSrc}}"></image> 就可以显示
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })
      },
      fail: e => {
        console.error(e)
      }
    })
  }
```



## 云开发实践-扫码图书小程序

配置两个tabBar，分别是首页、我的

- 首页
  - 获取数据库列表
  - 分页
  - 下拉刷新
  - 滚动加载
- 我的
  - 登陆
  - 扫码

### 我的

####  微信登录

登录逻辑：没登录的时候，显示登录按钮，登录之后显示微信头像

- 获取个人信息

  使用`<button open-type="getUserInfo" bindgetuserinfo="onGetUserInfo"></button>`来获取用户信息。

- 获取`openid`（用户的唯一标识，就像是微信的身份证）

  - 使用云函数`login`通过`cloud.getWXContext()`来获取微信调用过的上下文，openid/appid/unionid都包含在上下文中，需要`openid`直接return回去。

  - 在`onGetUserInfo()`事件里获取到用户信息之后，调用`login`云函数，在result中得到当前用户的openid。-

  - 把最后的openid和userInfo数据放在data里，用来判断登录状态，并使用`wx.set/getStorage()`来保持登录状态

#### 图书扫码入库

扫码逻辑：使用小程序扫码扫码并获取图书isbn码，调用云函数传入isbn码，然后使用云函数来爬取该isbn码对应图书在豆瓣图书的详细信息，把爬取信息存入数据库并返回在前端展示。

- 使用`wx.scanCode`扫码并获取图书isbn码
- 调用`getBookInfo`云函数，传入isbn码
- 在云函数中使用axios请求豆瓣，拿到搜索isbn的结果。
- 使用npm包`doubanbook`来解密获搜索到的加密数据
- 通过解密可以到的书籍详情url地址，使用npm包`cheerio`来爬取书籍详情，返回爬取的书籍详情
- 调用`getBookInfo`云函数，得到爬取的书籍详情，最后放在云数据库里。

### 首页

展示图书列表，下拉加载(分页)，上拉刷新。

#### 获取数据库列表

- 通过
```
db.collection('databaseName')
.get()
.then(callFun)
.catch(callFun)
```
来获取图书数据，记得先是声明`cosnt db = wx.cloud.database()`。
- 可以通过
```
db.collection('databaseName')..orderBy('create_time', 'desc').get().then(..).catch(..)
```
获得按照创建时间排序后的数据。
- 参考：[微信小程序文档-云开发-云数据库](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/Cloud.database.html)

#### 滚动加载&分页

- 滑动底部自动调用`onReachBottom(){}`生命周期函数，在函数内获取数据的信息，使用skip和limit控制每次获取的页面和数量。

#### 下拉刷新

- currentPages.json中配置：`enablepullDownRefresh：true`
- 使用`onPullDownRefresh(){}`生命周期函数执行下拉后的操作
- 可以直接这样：`onPullDownRefrech(){ this.onLoad() }`

## Taro
> Taro 是一套遵循 React 语法规范的 多端开发 解决方案。
现如今市面上端的形态多种多样，Web、React-Native、微信小程序等各种端大行其道，当业务要求同时在不同的端都要求有所表现的时候，针对不同的端去编写多套代码的成本显然非常高，这时候只编写一套代码就能够适配到多端的能力就显得极为需要。
使用 Taro，我们可以只书写一套代码，再通过 Taro 的编译工具，将源代码分别编译出可以在不同端（微信/百度/支付宝/字节跳动/QQ/京东小程序、快应用、H5、React-Native 等）运行的代码。

### 优势
- 支持React语法
- 跨端

### 缺点
- 登陆每个端都要写一次（微信/支付宝/百度），可以在配置里，根据每个端的不同，可以写不同的代码，
- 支付功能，也是和登陆类似，每个端单独写
- 跨端的后端需要自建服务器

## 跨多解决方案
根据环境变量`process.env.TARO_EN`判断端，为每个端都配置一套代码

[Taro官网](https://taro-docs.jd.com/taro/)
### 新建Taro App
```
npm install -g @tarojs/cli
taro init taroApp
cd taroApp
npm install
npm run dev:h5
npm run dev:weapp
```
在`componentsDidMonth(){consoloe.log(this.$route.parma.id)}`获取路由信息
- `wx.navgtor`可以改写为`Taro.navgtor`
- 使用`this.setState({value: ''})`改变数据状态
- 事件前面加`on`，如`onClick`，`onChange`
### Taro UI
- 多端使用同一风格的UI组件库
- 使用Taro UI 做todolist 
- 使用Taro 重新做一次扫码图书

## 微信支付
- 32位密钥，下载证书，对https是强需求 需要企业账号才能开通
- 小程序云开发+微信支付=潮流
- 微信支付，需要申请商户认证，
- 支付流程
 - 使用小程序后端和微信商户验证
 - 验证成功后后端保留数据，返回密钥
 - 小程序使用pay接口，调起支付。
 - 支付成功，后端在发给微信商户，
 - 微信商户返回支付结果，
 - 后端数据库里一直存有一份订单信息，跟随订单状态变化而变化
- 支付很麻烦，需要：
  - 小程序前端发起支付请求，调用pay接口
  - 小程序后端和微信商户验证密钥
  - 微信商户返回支付结果
- 微信支付是小程序前后端和微信商户的一系列验证的结果。

## 基于小程序云开发的CMS系统

> HTTP API 提供了小程序外访问云开发资源的能力，使用 HTTP API 开发者可在已有服务器上访问云资源，实现与云开发的互通。

###获取access_token

```javascript

axios.get('https://api.weixin.qq.com/cgi-bin/token', {
    params: {
        grant_type: 'client_credential',
        appid: '',
        secret: ''
    }
}).then(res => {
    access_token = res.data.access_token;// 获取到的凭证
}).catch(err => {
    console.log(err)
})
```

凭借这个token，即可对小程序云数据库进行增删改查操作，每次获得token的有效期不超过两个小时，超时便失效，需要重新获取。

### 查询数据库

```javascript
function getBooks(token) {
    axios.post('https://api.weixin.qq.com/tcb/databasequery?access_token=' + token, {
        env: 'env-id',
        query: "db.collection(\"doubanbooks\").where({}).get()"//查询数据库的命令
    }).then(res => {
        console.log("success", res.config, res.data)
    }).catch(err => {
        console.log('fail', err)
    })
}
```

这里有一个点，比较坑，此方法是post的请求，但是access_token是用`?`连接在网址后面的，需要注意。

更详细的增删改查操作=》[微信小程序云开发 HTTP API文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-http-api/database/databaseQuery.html)


## bug list

- 云环境：调用云函数前，需要查看app.js中的云环境id是否正确，如不填写环境id，则默认第一个云环境，查看云环境id`微信开发者工具-云开发-设置-环境设置`
- 包管理
  - 安装依赖：`npm install` 
  - 安装包并保存在package.json中：`npm install pagesName  --save `
  - 安装仅在生产环境中使用的包：`npm install pagesName -S`
  - 卸载包：`npm unintall pageName`
  - 删除node_modules依赖：`rm -rf node_modules`

- cheerio：在Node中使用jQuery的语法解析HTML，方便从爬取的数据中获取有效数据。
- 之前使用过云开发，重新换了电脑之后，云函数不见了，或者想升级自己的项目到云开发，需要做以下修改：
  - 将原来的代码放到 `miniprogram` 目录
  - 新增 `cloudfunctions` 目录
  - `app.json` 新增配置 `"cloud": true`
  - `project.config.json` 配置 `"miniprogramRoot":"miniprogram/"` 和 `"cloudfunctionRoot":"cloudfunctions/"`
  - 修改小程序基础库版本 `"libVersion": "2.3.0"` 
- 小程序云函数在开发环境下切换电脑后无法指定环境，之前在一台电脑上搭建成功小程序云开发框架，上传代码管理器之后，换一台电脑后，云开发的文件夹上显示未指定环境。解决方法如下：
  - 在cloudfunctions文件夹右键-------------->更多设置
  
  - 在云函数设置界面，点击设置按钮，设置云函数根目录到cloudfunctions
    问题解决