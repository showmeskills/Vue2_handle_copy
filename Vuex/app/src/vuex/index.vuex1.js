

export let Vue;


class Store{
    constructor(options){
        let state = options.state;
        let getters = options.getters;
        let mutations = options.mutations;
        let actions = options.actions;
        // 这里我们期望状态是响应式的，状态变化需要更新试图
        // this.state = state;
        this.getters = {};
        const computed = {};
        Object.keys(getters).forEach(getterKey=>{
            computed[getterKey]=()=>{
                //这里是有缓存的，如果依赖的值没有发生变化，那么这个函数不会重新执行
                return getters[getterKey](this.state);
            }
            Object.defineProperty(this.getters,getterKey,{
                get:()=>{
                    return this._vm[getterKey]
                }
            })
        })
        this._vm = new Vue({
            data:{
                $$state:state,
            },
            computed
        })
        this.mutations = mutations;
        this.actions = actions;
    }
    get state(){
        return this._vm._data.$$state
    }
    commit=(type,payload)=>{
        this.mutations[type](this.state,payload);
    }
    dispatch=(type,payload)=>{
        this.actions[type](this,payload)
    }
}

const install = (_Vue)=>{
    Vue = _Vue;
    
    Vue.mixin({
        beforeCreate() {
            if(this.$options.store){
                // means roote store
                this.$store = this.$options.store
            }else if(this.$parent && this.$parent.$store){
                this.$store = this.$parent.$store
            }
        },
    })
}

// use的时候会用到install方法
export default {
    Store,
    install
}