const constants = {
    PENDING: "PENDING",
    FULFILLED: "FULFILLED",
    REJECTED: "REJECTED"
}


function resolvePromise(promise, x, resolve, reject) {
    if(promise == x){
        return reject(new TypeError(`TypeError: Chaining cycle detected for promise #<myPromise>`))
    }
    if((typeof x === 'object' && x != null) || typeof x === 'function'){
        let called = false;
        try{
            let then = x.then;
            if(typeof then == 'function'){
                then.call(x,y=>{
                    if(called) return;
                    called = true;
                    resolvePromise(promise,y,resolve,reject);
                },r=>{
                    if(called) return;
                    called = true;
                    reject(r);
                })
            }else{
                //{} or function is function; there are not then
                resolve(x);
            }
        }catch(e){
            if(called) return;
            called = true;
            reject(e);
        }
    }else{
        resolve(x);
    }
}

// let x = {};
// Object.defineProperty(x,'then',{
//     get(){
//         throw new Error("abc")
//     }
// })

class Promise {
    constructor(executor) {
        this.status = constants.PENDING;
        this.value = undefined;
        this.reason = undefined;

        this.onResolveCallbacks = [];
        this.onRejectedCallbacks = [];
        const resolve = (value) => {
            if(value instanceof Promise){
                return value.then(resolve,reject);
            }
            if (this.status == constants.PENDING) {
                this.value = value;
                this.status = constants.FULFILLED;
                this.onResolveCallbacks.forEach(cb => cb(this.value));
            }
        }
        const reject = (reason) => {
            if (this.status == constants.PENDING) {
                this.reason = reason;
                this.status = constants.REJECTED;
                this.onResolveCallbacks.forEach(cb => cb(this.reason));
            }
        }
        try {
            executor(resolve, reject)
        } catch (e) {
            reject(e);
        }
    }
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
        onRejected = typeof onRejected === 'function' ? onRejected : e => { throw e};
        let p1 = new Promise((resolve, reject) => {
            if (this.status == constants.FULFILLED) {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value)
                        resolvePromise(p1, x, resolve, reject)
                    } catch (e) {
                        reject(e);
                    }
                })
            }
            if (this.status == constants.REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason)
                        resolvePromise(p1, x, resolve, reject)
                    } catch (e) {
                        reject(e);
                    }
                })
            }
            if (this.status == constants.PENDING) {
                // 发布订阅， 有可能调用then的时候没有成功也没有失败
                this.onResolveCallbacks.push(() => {
                    setTimeout(()=>{
                        try {
                            let x = onFulfilled(this.value);
                            resolvePromise(p1, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    })
                });
                this.onRejectedCallbacks.push(() => {
                    setTimeout(()=>{
                        try {
                            let x = onRejected(this.reason);
                            resolvePromise(p1, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    })
                });
            }
        })
        return p1;
    }
    static resolve(value){
        return new Promise((resolve,reject)=>{
            resolve(value);
        })
    }
    static reject(reason){
        return new Promise((resolve,reject)=>{
            reject(reason);
        })
    }
    catch(errCallBack){
        return this.then(null,errCallBack);
    }
}
Promise.deferred = function(){
    let dfd = {};
    dfd.promise = new Promise((resolve,reject)=>{
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd
}

Promise.all = function(promises){
    let result = [];
    let times = 0;
    return new Promise((resolve,reject)=>{
        function processResult(data,index){
            result[index] = data;
            if(++times  == promises.length){
                resolve(result);
            }
        }

        for(let i = 0; i < promises.length; i++){
            let promise = promises[i];
            Promise.resolve(promise).then((data)=>{
                processResult(data,i);
            }, reject)
        }
    })
}

Promise.race = function(promises){
    return new Promise((resolve,reject)=>{
        for(let i = 0; i < promises.length; i++){
            let promise = promises[i];
            Promise.resolve(promise).then(resolve, reject)
        }
    })
}

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

// 这里会拿到此方法的返回结果来测试是否符合规范
module.exports = {
    Promise,
    promisify,
    promisifyAll
};