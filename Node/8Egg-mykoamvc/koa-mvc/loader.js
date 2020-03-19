const fs = require('fs')
const path = require('path');
const Router = require('koa-router')
// 读取目录和文件 
function loadFile(dir, callback) {
    //获得绝对路劲  =>  D:\Github\KKB\Node\8Egg\koa-mvc\routes
    let url = path.resolve(__dirname, dir);
    // 读取目录    =>  ['index.js', 'users.js']
    let files = fs.readdirSync(url)
    //遍历
    files.forEach(f => {
        f = f.replace('.js', '');
        const file = require(url + '/' + f)
        callback(f, file)
    })
}
// test code
// loadFile('routes',(fileName, fileRouter)=>{
//     console.log(fileName, fileRouter)
// })

// 加载路由
function initRouter() {
    const router = new Router();
    loadFile('routes', (filename, routes) => {
        //设置index替换为默认地址 / 
        const prefix = filename === 'index' ? '' : `/${filename}`;
        Object.keys(routes).forEach(key => {
            //拿到方法和route前缀
            const [method, path] = key.split(' ');
            console.log(`正在映射地址：${method.toLocaleLowerCase()}${prefix}${path}`)
            //等同于 router.get('/user', ()=>{})
            router[method](prefix + path, routes[key])
        })
    })
    // 把路由都加好 在返回这个实例
    return router;
}
module.exports = {
    initRouter
}