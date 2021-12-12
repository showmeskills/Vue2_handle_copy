import {newArrayProto} from "./array"

class Observer{
    constructor(data){
        //Object.defineProperty 只能劫持已经存在的属性(vue里面会为此单独写一些api,$set,$delete)
        Object.defineProperty(data,'__ob__',{
            value:this,
            enumerable:false, // 将__ob__ 变成不可枚举; 不可以循环 不可以取值 防止死循环
        })
        //data.__ob__ = this; // array 中的this 是指向这个理的data;并且给数据加了一个标识
        if(Array.isArray(data)){
            //这里我们可以重写数组中的方法 7个变异方法
            data.__proto__ = newArrayProto//需要保留数组原有的特性，并且可以重写部分方法
           
            this.observeArray(data);//如果数组中放对象,可以监控到对象的变化
        }else{
            this.walk(data)
        }
    }
    walk(data){//循环对象对属性一次劫持
        //重新定义属性 (性能差)
        Object.keys(data).forEach(key=>defineReactive(data,key,data[key]))
    }
    observeArray(data){
        data.forEach(item=> observe(item))
    }
}
export function defineReactive(target,key,value){//闭包 属性劫持
    observe(value); // 对所有的对象都进行属性劫持; 深度属性劫持
    Object.defineProperty(target,key,{
        get(){//取值的时候 会执行get
            console.log("用户取值 key",key)
            return value
        },
        set(newValue){// 设置值 会执行set
            //console.log("用户设置值")
            if(newValue === value) return
            observe(newValue); // 当用户设置值的时候传的是个对象
            value = newValue
        }
    })
}

export function observe(data){
    //对这个对象进行劫持
    if(typeof data !== "object" || data == null) return; //只对对象进行劫持
    if(data.__ob__ instanceof Observer){
         //说明这个对象已经被代理过了
         return data.__ob__;
    }
    //如果一个对象被劫持过了，那就不需要再被劫持了(判断对象是否被劫持过,可以添加一个实例，用实例来判断是否被劫持过)
    return new Observer(data)
}