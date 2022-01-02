import Module from "./module";
import {forEachValue} from "../utils"

/*
    {
        _raw:原来用户定义的对象,
        state:原来用户定义的对象.state,
        _children:{
            a:{
               _raw:原来用户定义的对象,
               state:原来用户定义的对象.state,
               _children:{}
            },
            c:{
                _raw:原来用户定义的对象,
                state:原来用户定义的对象.state,
                _children:{}
            }
        }
    }
*/

class ModuleCollection {
    //我要知道谁是谁的福清，谁是儿子
    //ast 语法树的时候，通过stack来实现的
    constructor(options) {
        this.root = null;
        //[]建立一个栈结构
        this.register([], options);
    }
    register(path, rootModule) {
        let newModule = new Module(rootModule) //不用obj 用类是方便扩展
        if (this.root === null) {
            this.root = newModule
        } else {
            //问题:a模块中还有一个c模块 [a,c]; 
            //[a]
            //[a,b]
            //[a,c,b] : 使用reduce => [a:{...,_children}:c:{}]
            let parent = path.slice(0, -1).reduce((start, current) => {
                //return start._children[current]
                return start.getChild(current)
            }, this.root)
            parent._children[path[path.length - 1]] = newModule
        }
        if (rootModule.modules) {
            //[a]
            //[c]
            forEachValue(rootModule.modules, (moduleName, moduleValue) => {
                this.register(path.concat(moduleName), moduleValue)
            })
        }
    }
}

export default ModuleCollection