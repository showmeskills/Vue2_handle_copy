import {
    mergeOptions
} from "./utils"

export function initGlobalAPI(Vue) {
    
    Vue.options = {
        _base:Vue,
    };
    Vue.mixin = function (mixin) {
        //我们期望将用户的选项和全局的options进行合并, 下面的样子
        //{} {created:function(){}} => {created:[fn]} 第一次
        //{created:[fn]} {created:function(){}} => {created:[fn,fn]} 第二次
        this.options = mergeOptions(this.options, mixin);
        return this;
    }
    //可以手动创造组件进行挂载
    Vue.extend = function (options){
        //就是实现根据用户的参数 返回一个构造函数而已
        function Sub(options={}){ //最终使用一个组件 就是 new 一个实例
            this._init(options);// 就是默认对子类进行初始化
        }
        Sub.prototype = Object.create(Vue.prototype); // Sub.prototype.__proto__ === Vue.prototype
        Sub.prototype.constructor = Sub;
        //希望将户用的传递的参数和全局的vue.op stions来合并
        Sub.options = mergeOptions(Vue.options,options); //保存用户传递的选项
        return Sub;
    }
    Vue.options.components = {}; //全局指令 Vue.options.directives
    Vue.component = function (id,definition){
        //如果 definition 已经是一个函数了，说明用户自己调用了Vue.extend
        typeof definition === 'function' ? definition : Vue.extend(definition);
        Vue.options.components[id] = definition
    }
}