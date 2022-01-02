import install from "./install"

import ModuleCollection from "./module/module-collection"

// function forEachValue(obj, cb) { //用来循环对象
//     Object.keys(obj).forEach(key => {
//         cb(key, obj[key])
//     })
// }


// class Module{
//     constructor(rootModule){
//         this._raw=rootModule;
//         this._children = {};
//         this.state = rootModule.state
//     }
//     addChild(key,module){
//         this._children[key] = module 
//     }
//     getChild(key){
//         return this._children[key]
//     }
// }

// class ModuleCollection {
//     //我要知道谁是谁的福清，谁是儿子
//     //ast 语法树的时候，通过stack来实现的
//     constructor(options) {
//         this.root = null;
//         //[]建立一个栈结构
//         this.register([], options);
//     }
//     register(path, rootModule) {
//         let newModule = new Module(rootModule) //不用obj 用类是方便扩展
//         if (this.root === null) {
//             this.root = newModule
//         } else {
//             //问题:a模块中还有一个c模块 [a,c]; 
//             //[a]
//             //[a,b]
//             //[a,c,b] : 使用reduce => [a:{...,_children}:c:{}]
//             let parent = path.slice(0, -1).reduce((start, current) => {
//                 //return start._children[current]
//                 return start.getChild(current)
//             }, this.root)
//             parent._children[path[path.length - 1]] = newModule
//         }
//         if (rootModule.modules) {
//             //[a]
//             //[c]
//             forEachValue(rootModule.modules, (moduleName, moduleValue) => {
//                 this.register(path.concat(moduleName), moduleValue)
//             })
//         }
//     }
// }


function installModule(store, rootState, path, rootModule) {
    if (path.length === 0) {
        //root module 只有是子模块的时候 才需要将子模块的状态定义在根上面
        
    }
    //sub module
    rootModule.forEachMutation((mutationKey, mutationValue) => {
        store._mutations[mutationKey] = (store._mutations[mutationKey] || []);
        store._mutations[mutationKey].push((payload) => {
            mutationValue(rootModule.state, payload)
        })
    })
    rootModule.forEachAction((actionKey, actionValue) => {
        store._actions[actionKey] = (store._actions[actionKey] || []);
        store._actions[actionKey].push((payload) => {
            actionValue(store, payload)
        })
    })
    rootModule.forEachGetter((getterKey, getterValue) => {
        if(store._wrapperGetters[getterKey]){
            return console.warn("duplicate key")
        }
        store._wrapperGetters[getterKey] = ()=>{
            return getterValue(rootModule.state)
        }
    })
    rootModule.forEachModule((moduleKey,module)=>{
        installModule(store,rootState,path.concat(moduleKey),module)
    })
    console.log(store)
}

class Store {
    constructor(options) {
        //将选项进行一个格式化 操作
        this._modules = new ModuleCollection(options);
        this._mutations = Object.create(null);
        this._actions = Object.create(null);
        this._wrapperGetters = Object.create(null);

        //传入根状态 将所有的子状态都定义在这个根状态上
        const state = this._modules.root.state;
        installModule(this, state, [], this._modules.root)
    }

}



// use的时候会用到install方法
export default {
    Store,
    install
}