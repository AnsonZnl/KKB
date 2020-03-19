# Koa2源码解析
**听不懂，回头感兴趣在听一边，尤其模拟中间件函数组合使用哪块**

> 这是最后一节逻辑课，这节课时前面的学习的总结课，如果这节能听懂，说明就算掌握了Node&koa的原理和应用。了解deno.Ts。如果deno发展起来，koa2可能就是最后一个Node框架了。

# 课堂主题
- koa原理
- context
- Application解析
- 中间件机制
- 常见中间件（loger,static,iptable,router）

## 封装一个类Koa
``` javascript
const KKB = require('kkb');
const app = new KKB();
app.use((req, res)=>{
    res.widthHead = 200;
    res.body = 'Hello KKB'
})
app.listen(300, ()=>{
    console.log('server running at http://localhost:3000')
})
```

## context(上下文)
- koa 为了简化api,引入context概念，将原始的请求对象req和详情对象res封装并挂载到了context上，并在cnotext上设置setter和getter，从而简化操作。
- 利用setter & 和setter 挂载绑定
  1. 绑定挂载
  2. 在绑定挂载时，增加业务逻辑
``` javascript
const obj = {
    info: {
        name: 'znl',
        age: '18'
    },
    get name(){
        // 挂载到obj上
        return this.info.name;
    },
    set age(val){
        //加如自己的业务逻辑
        this.info.age = val + '岁';
    }
}
console.log(obj.name)// "znl"
obj.age = 20;
console.log(obj.info.age);// 20岁
// 参考 https://wangdoc.com/javascript/stdlib/attributes.html#%E5%AD%98%E5%8F%96%E5%99%A8
// ES6 https://es6.ruanyifeng.com/#docs/object
```
- koa源码：https://github.com/koajs/koa/blob/master/lib/response.js
阅读源码，要循序渐进，先从自己能看的懂得开始学，读不懂jQuery可以先去读zepat，就像小时候，看不懂英文的莎士比亚的，可以先去读一样的版本短小的故事。


## 中间件 （从函数组合加入异步就开始懵逼了）
![洋葱模型](https://github.com/AnsonZnl/PictureBed/blob/master/fe/%E6%B4%8B%E8%91%B1%E6%A8%A1%E5%9E%8B2.png?raw=true)
> Koa的中间件，其实就是**函数组合**加异步的模式; 
- 兼顾OOP和AOP（横向阶段）
- 函数编程，函数即逻辑（React 函数即组件 组件即页面）
``` javascript
// 函数组合使用  中间件原理
const add = (x, y)=> x+ y;
const square = z => z* z;

// 1.0 只能执行两个函数
//先执行add 然后得到返回值 在执行square
// const fn = (x, y) => square(add(x, y));
// const result = fn(1, 2);//3
// console.log(result)//9

// 2.0 可以把执行一系列函数进行组合执行
// const compose = (...[first, ...others])=>(...args)=>{
//     let ret = first(...args);//第一个函数的执行结果
//     others.forEach(fn =>{
//         ret = fn(ret);//带着之前的函数执行结果->依次执行之后的函数 
//     })
//     return ret;
// }
// let fn = compose(add,square,square);
// console.log(fn(1, 2))//1+2 * 3 * 3 =  81

// 3.0 加入 next() 和 异步(aysnc)

async function fn1(next){
    console.log("fn1");
    await next();
    console.log('end fn1')
}

async function fn2(next){
    console.log("fn2");
    await delay();
    await next();
    console.log('end fn2')
}
function fn3(next){
    console.log(fn3)
}
function delay(){
    return new Promise((reslove, reject)=>{
        setTimeout(()=>{
            reslove();
        }, 2000);
    })
}
function compose(middlewares){
    return function(){
        return dispatch(0);
        //执行第0个
        function dispatch(i){
            let fn = middlewares[i];
            if(!fn){
                return Promise.resolve();
            }
            return Promise.resolve(
                //没有异步的话：fn(middlewares)[i+ 1]
                fn(function next(){
                    // promise 完成后 在执行下一个
                    return dispatch(i + 1);
                })
            )
        }
    }
}

const middlewares = [fn1, fn2, fn3];
const finalFn = compose(middlewares);
finalFn();
// 最终返回一个函数
//f1 -> f2 -> end fn2 -> end fn1
```
### log日志
### ip黑名单
### static静态服务
## koa-router
> router.routes() => 挂载所有的路由


## 编码习惯
- 文件写自己的名字邮箱和更新&创建日期
- 写注释
- 取名 达意