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