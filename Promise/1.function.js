// 什么是高阶函数？  1.一个函数返回一个函数   2.一个函数可以接收一个参数是函数

// 利用高阶函数可以处理哪些问题  1) 扩展方法
function say(args) { // 我们需要对say方法进行扩展，但是不能修改源代码
    console.log('say', args)
}
Function.prototype.before = function (cb) {
    return (...args) => { // newSay
        cb();
        this(...args); // 扩展原来的函数
    }
}
let newSay = say.before(() => {
    console.log('beforeSay')
})
newSay('hello');


// 我们可以通过高阶函数来实现参数的保留
// 判断一个变量的类型有： typeof只能判断基础类型  instanceof 判断实例类型  constuctor可以看当前实例是由谁构造出来的
// Object.prototype.toString.call

function isType(typing) {
    return (val) => {
        return Object.prototype.toString.call(val) === `[object ${typing}]`
    }
}
// 利用高阶函数保留参数变量  ->  (函数柯里化, 函数的反柯里化）
let isString = isType('String'); // 比较就是函数声明的作用域和执行的作用域是不一样的，这时候就会导致闭包
console.log(isString('hello'));
console.log(isString(123));


// 函数柯里化 就是将对个参转化成一次传入一个参数
// 异步编程问题 主要有一个并发处理的问题