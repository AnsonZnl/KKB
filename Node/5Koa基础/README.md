## Koa
> [Koa](https://koa.bootcss.com/) ——基于Node.js的下一代web开发框架。
是一个新的 web 框架，由 Express 幕后的原班人马打造， 致力于成为 web 应用和 API 开发领域中的一个更小、更富有表现力、更健壮的基石。 通过利用 async 函数，Koa 帮你丢弃回调函数，并有力地增强错误处理。 Koa 并没有捆绑任何中间件， 而是提供了一套优雅的方法，帮助您快速而愉快地编写服务端应用程序。

## 中间件  
- next() 执行下一个中间件  
- 按照app.use()的顺序一个个的执行
- 当一个中间件调用 next() 则该函数暂停并将控制传递给定义的下一个中间件。当在下游没有更多的中间件执行后，堆栈将展开并且每个中间件恢复执行其上游行为。
看代码：
``` javascript
const Koa = require('koa');
const app = new Koa();
// demos/09.js
const one = (ctx, next) => {
  console.log('>> one');
  next();
  console.log('<< one');
}

const two = (ctx, next) => {
  console.log('>> two');
  next(); 
  console.log('<< two');
}

const three = (ctx, next) => {
  console.log('>> three');
  next();
  console.log('<< three');
}

app.use(one);
app.use(two);
app.use(three);
app.listen(3000,()=>{
    console.log('server run http://localhost:3000/')
})
```

上面代码的执行顺序是：
> one >> two >> three >> three >> two >> one


![洋葱模型](https://image-static.segmentfault.com/289/215/2892151181-5ab48de7b5013)

## 参考
- [Koa 官方文档](https://koa.bootcss.com/#context)  
- [阮一峰-Koa](http://www.ruanyifeng.com/blog/2017/08/koa.html)  
- [Github-ruanyf-Koa dome](https://github.com/AnsonZnl/koa-demos)  

## 错误处理  
使用try..catch捕捉错误->抛出错误->处理错误
- 中间件或者函数中出错   
- 事件级别错误 if 处理.. else 向上抛出  
- Koa on.error() - 应用级别错误 if 处理.. else 向上抛出  
- Node throw  - 服务级别错误 if 处理.. else 中断服务

## koa-router
> Koa-router是Koa的路由中间件。
[全面理解koa-router](https://github.com/zhangxiang958/zhangxiang958.github.io/issues/38)
- route/index
``` javascript
const Router = require('koa-router');
const router = new Router()
router.get('/', ctx=>{
    ctx.body = 'index'
})
module.exports = router
```
- routes/users
``` javascript
const Router = require('koa-router');
const router = new Router({
    prefix: '/users'
})
router.get('/', ctx => {
    ctx.body = 'users'
})
module.exports = router
```
- index.js
``` javascript
const Koa = require('koa');
const app = new Koa();
const index = require('./routes/index')
const users = require('./routes/users')

app.use(index.routes())
app.use(users.routes())
app.listen(3000, ()=>{
    console.log('server running http://localhost:3000')
})
```
## 模板引擎
- ejs、hbs [参考](https://www.jianshu.com/p/e01e733218a3)
- 模板语法部分没必要学，真正用到在学也不晚，先学关键部分
- 重视SEO和首屏渲染的话 使用SSR不管是Vue 还是React都很成熟了
``` javascript
cosnt hbs = require('koa-hbs')
app.use(hbs.middleware({
    viewPath: __dirname + '/views',//视图根目录
    defaultLayout: 'layout',//默认布局页面
    partialsPath: __dirname + 'view/partials'//注册partial目录
    disableCache: true//开发阶段 不缓存
}))
```

## 静态服务
``` javascript
cosnt static = require('koa-static');
app.use(static(__dirname + 'public'));
//然后就可以访问public目录下的文件了
//比如放一些css js img等等需要的静态文件
```
## Web Components
- web 组件化 就像原生的浏览器支持Vue一般丝滑
- [Web组件入门实例教程](http://www.ruanyifeng.com/blog/2019/08/web_components.html)
- [MDN-Web_Components](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components)
## Linux 基础
- 使用`ssh root@xx.xx.xx.xx`回车输入密码
- 公钥
生成公钥：ssh-keygen -t rsa -P ''
- 查看公钥 
cat xx公钥文件
使用公钥，可以进行免密登录，比如github就可以使用ssh 进行免密登录推送代码等

- 常用命令
``` 
cd             //进入目录
ls             //显示目录下文件
cat xxx.md     //查看
tail xx.md     //尾查看
tail -f xx.md  //一直在尾部查看 查看日志常用
vi xx.md       //编辑
:q             //退出编辑
pwd            //查看当前所在路径

```