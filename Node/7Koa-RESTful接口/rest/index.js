// koa-router 教程 https://www.jmjc.tech/less/120
// 廖雪峰 https://www.liaoxuefeng.com/wiki/1022910821149312/1023025933764960
// koa-router 解析post 参数 使用koa-bodyparser 
// 取参数 
// methods  request url      koa router   get params         
// get      /users/2         /user/:id    ctx.params
// post     /users           /users       ctx.request.body
// get      /users?name=xxx  /users       ctx.query
const fs = require('fs')
const Koa = require('koa');
const bodyParser = require('koa-bodyparser')
const app = new Koa();
app.use(bodyParser())

const users = [{
        id: 1,
        name: 'tom'
    },
    {
        id: 2,
        name: 'jeck'
    }
]

const router = require('koa-router')();
router.get('/', (ctx, next) => {
    ctx.type = 'text/html'
    ctx.body = fs.createReadStream('./index.html')
})



router.get('/users/:id', ctx => {
    let {
        id
    } = ctx.query //-> ? id = xxx
    console.log(id);
    let data;
    data = users;
    if(id){
        data = users.filter(e => e.id == id);
    }
    ctx.body = {
        statusCode: 200,
        data: data
    }
})

router.get('/users', ctx => {
    let {id} = ctx.query;//id=1
    console.log(id)
    let data;
    data = users;
    if(id){
        data = users.filter(e => e.id == id);
    }
    ctx.type = 'text/json'
    ctx.body = {
        statusCode: 200,
        data
    };
})

router.post('/users', ctx => {
    const {
        body
    } = ctx.request;
    // console.log(body)
    body.id = users.length + 1;
    users.push(body);
    ctx.response.body = {
        statusCode: 200,
        mes: '创建成功'
    }
})

router.put('/users', ctx => {
    let {
        body
    } = ctx.request;
    console.log(body)
    let index = users.findIndex(e => body.id == e.id);
    users.splice(index, 1);
    users[index] = body;
    ctx.body = {
        statusCode: 200,
        mes: '修改成功'
    }
})

router.delete('/users/:id', ctx => {
    console.log(ctx.params)
    let {
        id
    } = ctx.params;
    let userIdx = users.findIndex(e => id == e.id);
    users.splice(userIdx, 1);
    ctx.body = {
        statusCode: 200,
        mes: '删除成功'
    }
})

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000, () => {
    console.log("server running at http://localhost:3000")
})