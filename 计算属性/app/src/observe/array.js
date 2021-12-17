//我们希望可以写数组中的部分方法
let oldArrayProto = Array.prototype; //获取数组的原型

//newArrayProto.__proto__ = oldArrayProto
export let newArrayProto = Object.create(oldArrayProto)//生成新的数组方法

let methods = [ // 找到所有的变异方法
    'push',
    'pop',
    'shift',
    'unshift',
    'reverse',
    'sort',
    'splice'
]// concat slice 都不会改变原数组

methods.forEach(method=>{
    //arr.push([1,2,3])
    newArrayProto[method] = function (...args){//这里重写了数组的方法
        //this 调用什么方法就指向什么方法
        const result = oldArrayProto[method].call(this,...args);// 内部调用原来的方法,函数的劫持 切片变成

        //我们对新增的数据再次进行劫持
        let inserted;
        let ob = this.__ob__;
        switch(method){
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                inserted = args.slice(2);
            default:
                break;
        }
        if(Array.isArray(inserted)){
            //对新增的内容再次进行观测
            ob.observeArray(inserted)
        }
        ob.dep.notify();//数组变化了 通知对应的watcher实现更新
        return result
    }
})