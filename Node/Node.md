# Node.js
[Node 官网](!http://nodejs.cn/)
## Node基础

### 学习目标
- 优秀的前端- 可以和后端有效沟通
- 敏捷的全栈 - 快速开发全栈应用
- 构架师 - 践行工程化思想

### 与前端不同
- js核心语法不变
- 前端 BOM DOM
- 后端 fs http buffer event os

### 运行Node程序
- 使用`node index.js`
- 使用`nodemon`，可以监视文件改动，自动重启.
  - 安装nodemon：`npm i -g nodemon`
  - 使用nodemon：`nodemon index.js`

### debug工具
- `code runner` vsCode插件

### 模块
- 这块还有很多的概念不清晰，比如es6的模块和node的模块等，有时间多看看。
- 使用`let = require('modelName')`导入模块，使用`module.exprots = {..}`导出模块

### Buffer
- Buffer 用来处理二进制数据 
- `toString('utf-8');` 转码默认是`utf-8` 

### events
- [Node-Events参考文档](http://nodejs.cn/api/events.html)
- [Node 模块之事件(events)详解](https://www.jianshu.com/p/152fddf0628c)
events对象，又称为“事件触发器”.它是一种广泛用于异步编程的模式，是回调函数的事件化，又称“发布订阅模式”， events就是发布订阅模式的一个简单的实现。
这个模块比前端浏览器中DOM模块要简单的多，没有冒泡，捕捉等事件传递的方法。
它具有，addListener/on()、once()、removeListener()、removellListeners()和emit()等基本的事件监听模式的方法实现。
Node中的对象模型就是我们常见的订阅发布模式，Node.js核心API都采用了异步事件的驱动，所有可能触发事件的对象都是一个继承自EventEmitter类的子类实例对象，简单来说，就是Node帮我们实现了一个订阅发布模式。
我的理解：
前端浏览器的方法调用常用的大致分为两类
- 来自页面的事件，如：click、input、change等
- 使用ajax异步请求时候的异步调用，异步回调函数等。
这些都是定义好的函数，然后通过这些操作去触发提前定义好的函数，和events如出一辙。
例子：
```
//订阅
emitter.on('test',(mes)=>{
    consloe.log(`hello ${mes}`)
})
//发布
emitter.emit('test','world')
```


### Linux请求
- `curl -v https://v.qq.com/`

### mini-express
```
const http = require('http');
const url = require('url');
const router = []
class Appliction{
    get(path, handler){
        router.push({
            path,
            handler,
            method: "GET"
        })
    }
    post(path, handler){
        router.push({
            path,
            handler,
            method: 'POST'
        })
    }
    listen(){
        let server = http.createServer((req, res)=>{
            let pathName = req.url;// 获取请求的url 如： /index
            console.log(`请求地址：${pathName}`);//请求的地址
            router.forEach(item=>{
                let {path , handler, method} = item;
                if(pathName === path && method == req.method){
                    return handler(req, res)
                }
            })
        })
        
        server.listen(...arguments);
    }
}

module.exports = function (){
    return new Appliction()
}
```

## Node网络编程
### 启动node server
- 使用`http.createServer((req, res)=>{..}).listen(3000)`可以创建一个http服务

### http协议
 - 1xx 指令信息-请求已接受，待处理
 - 2xx 成功，表示请求成功已被接收
 - 3xx 重定向，要完成请求必须进行进一步的操作
 - 4xx 客户端错误，请求有语法错误或者请求无法完成
 - 5xx 服务器端错误，服务器未能完成合法请求
### 常见状态码
 - 200 ok 请求完成
 - 201 create ok 创建资源成功
 - 304 资源未过期，无需重复请求。
 - 400 Body Request  客户端语言错误，服务器不理解
 - 401 Unauthorized 请求未经授权，token过期或错误
 - 404 服务器找不到请求的资源
 - 500 服务器异常错误，
 - 503 服务器宕机，一段时间可能会回复。

### 跨域
因为浏览器的同源策略，当ajax请求的地址，与当前地址协议、域名、端口号不同时，就会发生跨域情况。跨域的解决方法：
 - jsonp,当发生跨域时`<script>`标签的url可以发出get请求.通过callFunction可以和后端通信。但只限于get
 - 代理服务器，同源策略是针对的刘浏览器端，可以通过请求同源的服务器，然后使用同源服务器请求目标服务器，得到结果在返回前端。
 - CORS 全称是`Cross Origin Resource Share`-跨域资源共享，CORS是w3c规范，真正意义上解决了跨域，他需要对请求进行检查并对响应头做相应处理，从而实现跨域，通过后端添加响应头Header`Access-Contorl-Allow-Origin`和允许请求源地址，请求分为简单请求和复杂请求，简单请求get/post/head，复杂请求需要使用options请求先进行预检。
*最推荐的是CORS*
```
// CORS 
res.setHeader('Content-type', 'application/json');//简单请求 时设置
res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');//简单请求 时设置 允许的跨域的源
res.setHeader('Access-Control-Allow_headers', 'x-token,Content-Type');//复杂请求时设置，允许的请求头
res.setHeader('Access-Control-Allow-Credentials', 'true');//跨域允许使用cookie
```

### 反向代理
正向代理隐藏真实的客户端，反向代理隐藏真实的服务端。
正向代理代理的对象是客户端，反向代理代理的对象是服务端
[知乎-什么是反向代理？](https://www.zhihu.com/question/24723688)

### cookie
 1. 客户端请求服务端，服务端响应头设置cookie`res.setHeader('Set-Cookie','cookie=123')`
 2. 之后客户端就会把接受的cookie的值存起来，然后每一次请求都会自动带上cookie。

同源下：直接设置响应头set-Cookie就可以，
跨域的情况下：服务器添加`res.setHeader('Access-Control-Allow-Credntials', 'true')`,前端ajax(axios)：`axios.defaults.withCredentials = true`

### 判断是否加上cookie
*前端*
- 在application中查看
- 控制台使用`document.cookie`

*后端*
- 接受请求的时 打印请求头`console.log(req.headers.cookie)`

### 爬虫
> 使用服务器请求目标服务器，通过网页解析拿到想要的数据。
使用cheerio，服务端的jQuery。

### IM通讯系统
- 使用ajax+轮询(前端使用定时器，一秒钟请求一次服务器数据)
- 使用WebSocket，服务端可向客户端推送消息，优秀的库：socket.io

## bugList
- 使用`npm init -y` 快速生成一个package.json文件