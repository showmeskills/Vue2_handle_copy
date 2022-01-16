// 前端常见的就是 同时发送多个请求，最终拿到多个请求的返回值 来进行渲染页面

const fs = require('fs'); //node中自带核心模块  
const path = require('path'); 
// js在执行的时候会有一个事件环的机制 默认先执行当前的上下文
// let school = {}
// function done(){
//     if(Object.keys(school).length === 2){
//         console.log(school)
//     }
// }
// 你不知道的javascript 开发者的理解
function after(times,callback){ // 暂存times 同时返回一个新的函数
    const obj = {}
    return function(value,key){ // done
        obj[key] = value;
        if(--times === 0){
            callback(obj);
        }
    }
}
const done = after(2,(obj)=>{ // 调用done两次后再去执行对应的回调
    console.log(obj);
})
fs.readFile(path.resolve(__dirname,'name.txt'),'utf8',function(err,data){
    done(data,'name')
})
fs.readFile(path.resolve(__dirname,'age.txt'),'utf8',function(err,data){
    done(data,'age')
})

// 将name和age放到同一个对象中