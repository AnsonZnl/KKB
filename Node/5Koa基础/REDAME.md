## 中间件
- next() 执行下一个中间件
- 按照app.use()的顺序一个个的执行
- 当一个中间件调用 next() 则该函数暂停并将控制传递给定义的下一个中间件。当在下游没有更多的中间件执行后，堆栈将展开并且每个中间件恢复执行其上游行为。
看代码：
``` javascript
const Koa = require('koa');
const app = new Koa();
const mid1 = async (ctx, next)=>{
    ctx.body = 'Hello';
    await next();
    ctx.body = ctx.body + ' !!'
}
const mid2 = async(ctx, next)=>{
    ctx.type = 'text/html;charset=utf-8';
    await next()
}
const mid3= async (ctx, next)=>{
    ctx.body = ctx.body + ' World';
    await next()
}
app.use(mid1);
app.use(mid2);
app.use(mid3);
app.listen(3000,()=>{
    console.log('server run http://localhost:3000/')
    //Hello World!!
})
```
上面代码的执行顺序是：
> mid1('Hello') -> mid2 -> mid3('World') -> mid1('!!') -> Hello World !!
![洋葱模型](https://image-static.segmentfault.com/289/215/2892151181-5ab48de7b5013)
参考：[Koa 官方文档](https://koa.bootcss.com/#context)

## 错误处理
使用try..catch捕捉错误->抛出错误->处理错误
- 中间件或者函数中出错 - 事件级别错误 if 处理.. else 向上抛出
- Koa on.error() - 应用级别错误 if 处理.. else 向上抛出
- Node throw  - 服务级别错误 if 处理.. else 中断服务
