import install, {
    Vue
} from "./install"

import ModuleCollection from "./module/module-collection"
import {
    forEachValue
} from './utils';


function getState(store,path){
    path.reduce((start,current)=>{
        return start[current]
    },store.state)
}

function installModule(store, rootState, path, rootModule) {
    if (path.length === 0) {
        //root module 只有是子模块的时候 才需要将子模块的状态定义在根上面
        // [a,c] 
        // [b]
        // 让c的模块定义在a上
        let parent = path.slice(0, -1).reduce((start, current) => {
            return start[current]
        }, rootState)
        store._withCommiting(()=>{
            Vue.set(parent,path[path.length - 1],rootModule.state)
            //parent[path[path.length - 1]] = rootModule.state
        })
    }
    let namespaced = store._modules.getNamespace(path);
    //sub module
    rootModule.forEachMutation((mutationKey, mutationValue) => {
        store._mutations[namespaced + mutationKey] = (store._mutations[mutationKey] || []);
        store._mutations[namespaced + mutationKey].push((payload) => {
            store._withCommiting(()=>{
                mutationValue(getState(store,path), payload); //更改状态的时候肯定是在commiting为true
            })
            store.subscribes.forEach(fn=>fn({type:mutationKey,payload:payload},rootState));
        })
    })
    rootModule.forEachAction((actionKey, actionValue) => {
        store._actions[namespaced + actionKey] = (store._actions[actionKey] || []);
        store._actions[namespaced + actionKey].push((payload) => {
            let result =  actionValue(store, payload)
            return result;
        })
    })
    rootModule.forEachGetter((getterKey, getterValue) => {
        if (store._wrapperGetters[namespaced + getterKey]) {
            return console.warn("duplicate key")
        }
        store._wrapperGetters[namespaced + getterKey] = () => {
            return getterValue(getState(store,path))
        }
    })
    rootModule.forEachModule((moduleKey, module) => {
        installModule(store, rootState, path.concat(moduleKey), module)
    })
}

function resetStoreVM(store, state) {
    let oldVm = store._vm;
    store.getters = {};
    const computed = {}
    const wrapperGetters = store._wrapperGetters


    forEachValue(wrapperGetters, (getterKey, getterValue) => {
        computed[getterKey] = getterValue //将刚才包裹的计算属性 赋予给计算属性
        Object.defineProperty(store.getters, getterKey, {
            get: () => {
                return store._vm[getterKey]
            }
        })
    })

    store._vm = new Vue({
        data: {
            $$state: state,
        },
        computed
    })
    if(store.strict){
        //sync 为true 默认监控
        store._vm.$watch(()=>store._vm._data.$$state,()=>{ //良妃性能，在开发情况下可以开启
            console.assert(store._commiting,'outside mutation')
        },{sync:true,deep:true})
    }
    if(oldVm){
        Vue.nextTick(()=>oldVm.$destroy())
    }
}

class Store {
    constructor(options) {
        //将选项进行一个格式化 操作
        this._modules = new ModuleCollection(options);
        this._mutations = Object.create(null);
        this._actions = Object.create(null);
        this.strict = options.strict;//是否是严格模式
        //如何得知在mustation中更改
        this._cimmiting = false;
        this._wrapperGetters = Object.create(null);
        this.plugins = options.plugins || [];
        //传入根状态 将所有的子状态都定义在这个根状态上
        const state = this._modules.root.state;
        this.subscribes = [];
        installModule(this, state, [], this._modules.root)
        resetStoreVM(this, state); //create instance 让计算属性和state声明到我们的实例上
        //插件要立刻执行
        this.plugins.forEach(plugin=>plugin(this))
    }
    _withCommiting(fn){
        this._cimmiting = true;
        fn();
        this._cimmiting = false;
    }
    commit=(type,payload)=>{
        debugger
        if(this._mutations[type]) this._mutations[type].forEach(fn=>fn.call(this,payload))
    }
    dispatch=(type,payload)=>{
        //if(this._actions[type]) this._actions[type].forEach(fn=>fn.call(this,payload))
        if(this._actions[type]){
            return Promise.all(this._actions[type].map(fn=>fn.call(this,payload)))
        }
    }
    subscribe(fn){
        this.subscribes.push(fn);
    }
    replaceState(state){
        this._withCommiting(()=>{
            this._vm._data.$$state = state;
        })
    }
    registerModule(path,module){ //module 是用户的对象
        this._modules.register(path,module); //你将用户
        installModule(this,this.state,path,module.newModule)
        resetStoreVM(this,this.state) // 重置当前实例
    }
    get state() {
        return this._vm._data.$$state
    }
}



// use的时候会用到install方法
export default {
    Store,
    install
}


//vuex 中可以提供一个插件机制 持久话的方式 1.重新渲染时访问后台接口 2.可以存储本地
// mutation (修改状态 strict模式)和 action (处理公共异步逻辑) action 支持Promise