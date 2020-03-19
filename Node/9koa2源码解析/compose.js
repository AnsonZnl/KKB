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