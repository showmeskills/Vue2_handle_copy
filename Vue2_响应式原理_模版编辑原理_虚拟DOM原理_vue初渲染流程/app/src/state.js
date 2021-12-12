import {observe} from "./observe/index"

export function initState(vm){
    const opts = vm.$options //获取所有的选项
    if(opts.data){
        initData(vm);
    }
}

function proxy(vm,target,key){
    Object.defineProperty(vm,key,{  // vm.name
        get(){
            return vm[target][key]; //vm._data.name 改成 vm.name
        },
        set(newValue){
            vm[target][key] = newValue// 同上取值
        }
    })
}   

function initData(vm){
    let data = vm.$options.data;
    data = typeof data === 'function' ? data.call(vm) : data;
    vm._data = data; //我将返回对象放到了_data上了
    //对数据进行劫持 vue2里采用了一个api defineProperty
    observe(data)

    //将vm._data 用vm来代理就可以了
    for(let key in data){
        proxy(vm,'_data',key)
    }
}
