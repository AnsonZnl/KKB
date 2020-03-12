const Koa = require('koa');
const app = new Koa();

const hello = async (ctx, next) => {
    // ctx.status = 500;
    ctx.body = 'Hello World';
    next()
}
const err = async (ctx, next) => {
    try {
        await next()
    } catch (error) {
        // 响应用户
        ctx.status = error.statusCode || error.status || 500;
        ctx.body = error.message;
        // 触发应用级别的错误事件 （Koa级别错误）
        ctx.app.emit('error', error, ctx);
        // 中间件报错 （事件级别错误）
        console.log('捕捉到错误：', error.message)
    }
}

app.on('error', err => {
    console.log('全局错误错误', err.message)
    // Node 级别错误
    // throw err;
})

// const sleep = async (ctx)=>{
//     await setTimeout((ctx)=>{
//          ctx.body = ctx.body + '123'
//     }, 1000)
// }
const test = async (ctx, noxt) => {
    sleep()
    ctx.body = ctx.body + 'test';
    next()
}
app.use(err)
app.use(hello);
app.use(test)
//开始监听端口，等同于http.createServer(app.callback()).listen(3000);
app.listen(3000, () => {
    console.log('server run http://localhost:3000')
})