# Koa实战-鉴权
参考：
- [傻傻分不清之 Cookie、Session、Token、JWT](https://juejin.im/post/5e055d9ef265da33997a42cc)
- [阮一峰*json-web-token入门](http://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html)
## Session & Cookie
### Cookie
- 在服务端接收到请求后
- 在响应头加上Set-Cookie字段，就会自动被保存在客户端浏览器上
- 然后每次请求都会自动在请求头上携带cookie
- 从而可以达到利用cookie识别用户身份。
```javascript
const http = require('http');
http.createServer((req, res)=>{
    if(req.url == '/favicon'){
        return
    }else{
        console.log('cookie:', req.headers.cookie)
        //cookie: name=aaabbcc
        res.setHeader('Set-Cookie','name=aaabbcc');
        res.end('Hello Cookie')
    }
}).listen(3001)

```
### Session
- 已经设置了Cookie，并把Cookie的值设成一个Session的键
- 后端维护一个Session库，拿到SesionID去查询 用户信息
- session是在设置了Cookie的情况下，**把Cookie的值设置为一个session的键**。，接收到Cookie中的SessionId后，查询后端维护的一个Session库，通过sessionId去session库中查询，用来识别用户身份。

![session流程图](https://github.com/AnsonZnl/PictureBed/blob/master/img/session%E6%B5%81%E7%A8%8B%E5%9B%BE.png?raw=true)

**实现原理**
1. 创建session-服务器在接受客户端首次访问时，在服务器端创建session，然后保存session（我们可以将session保存在内存中，也可以保存在Redis中，推荐使用后者），然后给这个session生成一个唯一的标识字符串，然后在响应头中种下这个唯一的标识字符串。
2. 签名-这一步通过秘钥对sid进行签名处理（签名：对已加密的数据进行哈希，避免客户端修改sid.（非必须步骤，注重安全可以加）
3. 接受session-浏览器的请求在收到响应时，会解析响应头，然后将sid保存在本地cookie中，浏览器在下次http请求时，会在请求头中带上该域名下的cookie信息
4. 查询session- 服务器在接受客户端请求时回去解析请求头中的sid,然后根据这个sid去服务器端的session库（Redis）查询该用户的session，然后判断该请求是否合法。

> 哈希算法 SHA MD5 （常用于签名-signed）
1. 把不定长摘要设定为定长结果，
2. 摘要（防窜改），不可逆
3. 雪崩效应，密文略微变化，明文就剧烈变化（牵一发而动全身）

``` javascript
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


```
### Redis - 键值对服务器
- [下载安装](https://www.runoob.com/redis/redis-install.html)
- [官方文档](https://redis.io/)
**下载安装**
1. 下载解压到文件夹redis里
2. 当前文件夹cmd中输入`redis-server.exe redis.windows.conf`
3. 然后成功!!
4. 这时候另启一个 cmd 窗口，原来的不要关闭，不然就无法访问服务端了。
5. 切换到 redis 目录下运行:`redis-cli.exe -h 127.0.0.1 -p 6379`
6. 设置键值对:`set myKey abc`
7. 取出键值对:`get myKey`
``` JavaScript
const redis = require('redis');
const client = redis.creatClient(6379, 'localhost')
client.set('name', 'redis')
client.get('name',(err,value)=>{
    console.log('resdis key:',value)
    //output redis
})
```

## Token
> 在非浏览器环境不支持Cookie&Session机制，多端应用下使用Token是一种合理的方法。不需要Redis即可验证。
1. 客户端使用用户名和密码请求登录
2. 服务端收到请求，去验证用户名与密码
3. 验证成功后，服务端会签发一个令牌（token），再把这个Token发送给客户端
4. 客户端收到Token后把他存起来，比如放在Cookie或者LocalStorage里。
5. 客户端每次向服务端请求资源的时候需要带着服务端签发的Token
6. 服务端收到请求，回会去验证客户端请求里带的Token，如果验证成功，就像客户端返回请求的数据，验证失败，则重新获取Token。

![token 流程](https://github.com/AnsonZnl/PictureBed/blob/master/fe/Token%20%E6%B5%81%E7%A8%8B%E5%9B%BE.png?raw=true)

### JWT（JSON WEB TOKEN）
原理解析:Bearer Token包含三个组成部分(使用.分隔)：令牌头、payload、哈希
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoidGVzdCIsImV4cCI6MTU4NDI3ODEzMSwiaWF0IjoxNTg0Mjc0NTMxfQ.Rnd92KlDxd3LTDLDMbK6I_G0XzPUWWVDm5WOKCrMEVY
```
1. 签名：默认使用base64对令牌头、payload进行编码，使用hash256算法对令牌头、payload和秘钥进行签名生成哈希
2. 验证：默认使用hash256算法对hash256算法对令牌中的数据签名并将结果和令牌中哈希对比

## OAuth（开放授权）
使用第三方：如使用QQ、微信、GitHub授权登录.
> 概述：三方登录主要基于OAuth2.0.OAuth协议为用户资源的授权提供了一个安全的、开放而又简易的标准，与以往的授权方式不同之处在于OAuth的授权不会使用第三方触及到用户的账号信息（账号、密码）。即第三方无需使用用户的账号名和密码就可以申请获得该用户资源的授权，因此OAuth是安全的。

![OAuth 授权](https://github.com/AnsonZnl/PictureBed/blob/master/fe/OAuth.png?raw=true)

### 使用Github授权登录
登录github >> setting >> Developer settings >> OAuth APP >> 注册 >> 获得Client ID & Client Secret

![github for OAuth](https://github.com/AnsonZnl/PictureBed/blob/master/fe/OAuthforgithub.png?raw=true)

**授权流程**    
举例来说，A 网站允许 GitHub 登录，背后就是下面的流程。
1. A 网站让用户跳转到 GitHub。
2. GitHub 要求用户登录，然后询问"A 网站要求获得 xx 权限，你是否同意？"
3. 用户同意，GitHub 就会重定向回 A 网站，同时发回一个授权码。
4. A 网站使用授权码，向 GitHub 请求令牌。
5. GitHub 返回令牌.
6. A 网站使用令牌，向 GitHub 请求用户数据。
7. github返回用户数据（包括name avatar等）

注意：测试时，需删除github的cookie,不然会报错
参考： [阮一峰-GitHub OAuth 第三方登录示例教程](http://www.ruanyifeng.com/blog/2019/04/github-oauth.html)

