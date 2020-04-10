// EventLoop JS是单线程语言：顺序执行
// 任务队列
// 宏任务（macro-task）：整体代码<script> setTimeout setInterval
// 微任务（micro-task）：Promise
// Promise new 之后 会立即执行 then是微任务

// demo 1
/*
setTimeout(function () {
    console.log('1')
});
new Promise(function (resolve) {
    console.log('2');
    for (var i = 0; i < 10000; i++) {
        i == 99 && resolve();
    }
}).then(function () {
    console.log('3')
});
console.log('4');
*/
// output: 2 4 3 1
// 解析：
// script 同步任务开始执行 当前无微任务 执行宏任务：
// 2 Promise new 之后会立即执行
// 4 同步任务 结束
// 3 then 是微任务
// 1 setTimeout 是宏任务

//demo 2
console.log('1'); // 1

let s1 = setTimeout(function () {
    console.log('2'); // 4
    let p1 = new Promise(function (resolve) {
        console.log('3'); // 5
        resolve();
    }).then(function () {
        console.log('4') // 6
    })
})

new Promise(function (resolve) {
    console.log('5'); // 2
    resolve();
}).then(function () {
    console.log('6') // 3
})

let s2 = setTimeout(function () {
    console.log('7'); // 7
    let p2 = new Promise(function (resolve) {
        console.log('8'); // 8
        resolve();
    }).then(function () {
        console.log('9') // 9
    })
})

// output：1 5 6 2 3 4 7 8 9

// 解析：
// 同步任务开始
// 1 同步任务
// 5 new Promise p1立刻执行 - 当前有一个微任务then 和两个宏任务 setTimeout
// 同步任务结束
// 执行EventLoop 
// 6 then 执行微任务 - 当前还有两个宏任务 无微任务
// 2 3 执行第一个setTimeout - 当前还有一个宏任务(s2) 和 第一个宏任务产生的一个微任务(p1 then)
// 4 执行微任务(p1 then) - 当前还有一个宏任务(s2)
// 7 8 执行宏任务(s2) - 当前还有一个微任务(p2 then)
// 9 执行微任务(p2 then) 当前无任务 

// 参考
//  - [JS事件循环](https://www.evernote.com/shard/s276/client/snv?noteGuid=bd303477-ffb2-416e-a2b0-720b33c3053a&noteKey=8e440924a3557344b3dd185c0dda3559&sn=https%3A%2F%2Fwww.evernote.com%2Fshard%2Fs276%2Fsh%2Fbd303477-ffb2-416e-a2b0-720b33c3053a%2F8e440924a3557344b3dd185c0dda3559&title=JS%25E4%25BA%258B%25E4%25BB%25B6%25E5%25BE%25AA%25E7%258E%25AF)
//  - [译文：JS事件循环机制（event loop）之宏任务、微任务](https://segmentfault.com/a/1190000014940904)


// 函数柯里化

// promise

// new 

// call apply bind

// 防抖 & 节流