const fs = require('fs');
const path = require("path");

function promisify(fn){
    return function(...args){
        return new Promise((resolve,reject)=>{
            fn(...args,function (err,data){
                if(err) return reject(err);
                resolve(data);
            })
        })
    }
}

function promisifyAll(obj){
    let result = {};
    for(let key of obj){
        result[key] = typeof obj[key] == 'function' ? promisify(obj[key]) : obj[key];
    } 
    return result;
}

let fsPromises = promisifyAll(fs);
Promise.all([fsPromises.readFile(path.resolve(__dirname,"name.txt"),'utf-8').then((data)=>{
    console.log(data);
})])