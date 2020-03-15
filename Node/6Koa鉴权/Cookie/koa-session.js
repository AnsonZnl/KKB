const Koa = require('koa');
const app = new Koa()
const session = require('koa-session');

app.keys= ['some secret']

const SESS_CONFIC = {
    key: 'kkb:session',//cookie key
    maxAge: 864000,//有效期
    httpOnly: true,//js不可读 服务器有效
    signed: true//签名-hash加密
}
app.use(session(SESS_CONFIC,app));//用中间件
app.use(ctx=>{
    if(ctx.path == '/favicon.ico') return ;
    let n = ctx.session.count || 0;
    ctx.session.count = ++n;
    ctx.body = `第${n}次访问`;
})
app.listen(3000,()=>{
    console.log('server running at http://localhost:3000')
})