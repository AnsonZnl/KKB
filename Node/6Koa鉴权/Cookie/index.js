const http = require('http');
this.sessionObj={};//应该是Redis
http.createServer((req, res)=>{
    if(req.url == '/favicon'){
        return
    }else{
        let cookie = req.headers.cookie;
        if(cookie && cookie.indexOf('sKey') > -1){
            // 已经设置cookie并有sKey的情况
            let sid = cookie.slice(-2);//拿到sKey的值sid
            console.log(this.sessionObj,this.sessionObj[sid])
            console.log(`用户的cookie:${cookie},用户的sid:${sid},用户的name:${this.sessionObj[sid]},Session库：${this.sessionObj.toString()}`)
            res.end('Hello Session')
        }else{
            // 没有设置cookie 的情况
            console.log('cookie:',req.headers.cookie)
            let sid = (+new Date()).toString().slice(-2);
            //生成一个两位数的随机的sid
            res.setHeader('Set-Cookie',`sKey=${sid}`);
            this.sessionObj[sid] = {name: 'koa'}
            console.log(`session库：`,this.sessionObj)
            //这个随便填写信息 正常应该是用户的身份信息 比如姓名等等
            res.end('Hello Cookie')
        }
    }
}).listen(3001)
