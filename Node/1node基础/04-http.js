const http = require('http');
const fs = require('fs')
let server = http.createServer((req, res) => {
    let {
        url,
        method
    } = req;
    // console.log(`request ${url} ${method}`)
    if (url === '/index' && method === "GET") {
        fs.readFile('index.html', (err, data) => {
            if (err) {
                res.writeHead(500, {
                    "Content-Type": "text/plain;charset=utf-8"//响应 状态码 和 返回内容格式 charset = utf-8 防止中文乱码
                }); 
                res.end('Server Error 服务器 出错')
            }
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html")
            res.end(data)
        })
    }else if(url === "/users" && method === "GET"){
        res.statusCode = 200;
        res.setHeader("Coetent-Type", "application/json");
        res.end(JSON.stringify({name: 'znl'}))
    }else {
        res.end('404')
    }
})
server.listen(3000)