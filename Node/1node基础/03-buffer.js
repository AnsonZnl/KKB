
// Buffer 用来处理二进制数据
let buf1 = Buffer.alloc(10);// 在内存中开辟一段空间
console.log(buf1)

let buf2 = Buffer.from('Hello World');
console.log(buf2)// 1. 把hello World 转成16进制 
console.log(buf2.toString('utf-8'))//2. 使用 toString() 转换过来 可以指定 转码格式 默认utf-8

