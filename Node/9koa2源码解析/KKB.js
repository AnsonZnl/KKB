const http = require('http');
class KKB{
    listen(...args){
        const server = http.createServer((req, res)=>{
            this.callback(req, res);//把req,res赋给示例对象
        })
        server.listen(...args)//监听端口和回调
    }
    use(callback){
        this.callback = callback
    }
}
module.exports = KKB