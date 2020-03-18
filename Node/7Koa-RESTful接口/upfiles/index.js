const fs = require('fs')
const Koa = require('koa');
const bodyParser = require('koa-bodyparser')
const multer = require('koa-multer')
const captcha = require('trek-captcha')
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
        var fileFormat = (file.originalname).split("."); //以点分割成数组，数组的最后一项就是后缀名
        cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
})
//加载配置
var upload = multer({
    storage: storage
});
// 加载index.html
const router = require('koa-router')();
router.get('/', (ctx, next) => {
    ctx.type = 'text/html'
    ctx.body = fs.createReadStream('./index.html')
})

// 上传接口
router.post('/upload', upload.single('file'), ctx => {
    console.log(ctx.req.body) //文件body
    console.log(ctx.req.file) //文件信息
    ctx.body = '上传成功'
})

// 图形验证码
router.get('/captcha', async ctx=>{
    const {token, buffer} = await captcha({size: 4});
    console.log(token, buffer)
    ctx.body = buffer
})

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000, () => {
    console.log("server running at http://localhost:3000")
})