
const constants = {
    PENDING:"PENDING",
    FULFILLED:"FULFILLED",
    REJECTED:"REJECTED"
}


class Promise{
    constructor(executor) {
        this.status = constants.PENDING;
        this.value = undefined;
        this.reason = undefined;

        this.onResolveCallbacks = [];
        this.onRejectedCallbacks = [];
        const resolve = (value)=>{
            if(this.status == constants.PENDING){
                this.value = value;
                this.status = constants.FULFILLED;
                this.onResolveCallbacks.forEach(cb=>cb(this.value));
            }
        }
        const reject = (reason)=>{
            if(this.status == constants.PENDING){
                this.reason = reason;
                this.status = constants.REJECTED;
                this.onResolveCallbacks.forEach(cb=>cb(this.reason));
            }
        }
        try{
            executor(resolve,reject)
        }catch(e){
            reject(e);
        }
    }
    then(onFulfilled, onRejected){
        if(this.status == constants.FULFILLED){
            onFulfilled(this.value)
        }
        if(this.status == constants.REJECTED){
            onRejected(this.reason)
        }
        if(this.status == constants.PENDING){
            // 发布订阅， 有可能调用then的时候没有成功也没有失败
            this.onResolveCallbacks.push(onFulfilled);
            this.onRejectedCallbacks.push(onRejected);
        }
    }
}

module.exports = Promise;