import { forEachValue } from '../utils';


class Module{
    constructor(rootModule){
        this._raw=rootModule;
        this._children = {};
        this.state = rootModule.state
    }
    addChild(key,module){
        this._children[key] = module 
    }
    getChild(key){
        return this._children[key]
    }
    forEachMutation(cb){
        if(this._raw.mutations){
            forEachValue(this._raw.mutations,cb)
        }
    }
    forEachAction(cb){
        if(this._raw.actions){
            forEachValue(this._raw.actions,cb)
        }
    }
    forEachGetter(cb){
        if(this._raw.getters){
            forEachValue(this._raw.getters,cb)
        }
    }
    forEachModule(cb){
        // 这里循环模块 应该循环包装后的 这样拿到是 带有模块方法的对象
        forEachValue(this._children,cb)
    }
}

export default Module;