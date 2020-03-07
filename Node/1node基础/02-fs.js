const fs = require('fs');

// 同步读取
// let data = fs.readFileSync('package.json');
// console.log(data)//buffer  二进制格式
// console.log(data.toString());//正常格式

// 异步读取
// fs.readFile('./package.json',(err,data)=>{
//     console.log(data.toString())
// })

// promise 方式
// const {
//     promisify
// } = require('util');//Node 内置的库
// const readFile = promisify(fs.readFile);
// readFile('./package.json').then(data => {
//     console.log(data.toString())
// })

// asyc await 方式读取
// const {promisify} = require('util');
// const readFile = promisify(fs.readFile);
// async function myReadFile(){ // async 表示这个函数里有需要等待的异步操作 实际上是generator 的语法糖
//     let data = await readFile('./package.json');// 等待这个异步操作结束 在进行下一步执行  yield语法糖
//     console.log(data.toString())
// }
// myReadFile()


// 自己把 fs.readFile() 方法包装成promise 方法

// 1. 回调函数
// function myReadFile(url) {
//     return new Promise((resolve, rejuect)=>{
//         fs.readFile(url, (err, data) => {
//             if(err) rejuect(err);
//             resolve(data)
//         })
//     })
// }

// 2. promise
// myReadFile('./package.json').then(data=>{
//     console.log(data.toString())
// }).catch(err=>{
//     console.error(err)
// })

// 3. async 
// (async ()=>{
//     let data = await myReadFile('./package.json');
//     console.log(data)
// })()