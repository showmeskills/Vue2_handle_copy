const Promise = require("./6.promise");

const promise = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve("ok")
    },1000)
})
promise.then((val)=>{
    return 100+val;
}).then(res=>{
    console.log(res)
})