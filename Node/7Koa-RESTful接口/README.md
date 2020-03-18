## RESTful接口
- 每一种URL代表一种资源（http://kkb.com/course）
- 客户端和服务器传递这种资源的表现层(get post put delete 对应 查增改删)
- 表现层状态转换 url设计使用**动+宾结构**（动词:get psot put delete）(宾语：名词/复数/避免多级)
参考：[阮一峰-RESTful API 最佳实践](http://www.ruanyifeng.com/blog/2018/10/restful-api-best-practices.html)

## 调试方式
- postman
- 前端写一个页面调试（vue+axios）
- easy-mock（前端模拟数据）
- swagger(java+vue)
自己实现了一个简单RESTful接口
``` javascript
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

```
## 文件上传 
> 使用koa-multer
```
const fs = require('fs')
const Koa = require('koa');
const bodyParser = require('koa-bodyparser')
const multer = require('koa-multer')
const app = new Koa();
app.use(bodyParser())

//文件上传 配置
var storage = multer.diskStorage({
  //文件保存路径
  destination: function (req, file, cb) {
    cb(null, 'public/')
  },
  //修改文件名称
  filename: function (req, file, cb) {
    var fileFormat = (file.originalname).split(".");  //以点分割成数组，数组的最后一项就是后缀名
    cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
})
//加载配置
var upload = multer({ storage: storage });

const router = require('koa-router')();
router.get('/', (ctx, next) => {
    ctx.type = 'text/html'
    ctx.body = fs.createReadStream('./index.html')
})

router.post('/upload', upload.single('file'),ctx=>{
    console.log(ctx.req.body)//文件body
    console.log(ctx.req.file)//文件信息
    ctx.body = '上传成功'
})

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000, () => {
    console.log("server running at http://localhost:3000")
})
```
## 表单验证
> 使用 koa-bouncer

## 图形验证码
> 使用 trek-captcha

## 发送短信
> 滴秒短信 注册免费送10块 需要营业执照（仅对公）
> 依赖 moment md5 axios querystring(处理query字符串) 

## 注册功能
- 图形验证码
- 短信验证码
- 表单验证
- 文件上传

