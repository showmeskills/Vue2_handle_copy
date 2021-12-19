import {
    initState
} from "./state";
import {
    compileToFunction
} from "./compiler/index";
import {callHook, mountComponent} from "./lifecycle";
import { mergeOptions } from "./utils";
export function initMixin(Vue) { //就是给Vue增加init方法
    Vue.prototype._init = function (options) { //永远初始化
        const vm = this;
        //以$开头的都是 Vue属性
        //我们定义的全局指令和过滤器.. 都会挂在实例上
        vm.$options = mergeOptions(this.constructor.options,options) //将options 挂载到Vue实例

        callHook(vm,'beforeCreate');

        //初始化状态,初始化计算属性，初始化watcher
        initState(vm);

        callHook(vm,'created');

        if (options.el) {
            vm.$mount(options.el)
        }
    }
    Vue.prototype.$mount = function (el) {
        const vm = this;
        el = document.querySelector(el);
        let ops = vm.$options
        if (!ops.render) { //先进行查找有没有render函数
            let template; //没有render看一下是否写了template,没写template采用外部的template
            if (!ops.template && el) { //没有模版但是写了el
                template = el.outerHTML
            } else {
                // if (el) {
                //     template = ops.template //如果有el 则采用模版的内容
                // }
                template = ops.template //如果有el 则采用模版的内容
            }
            //写了template 就用写了的template
            if (template) {//只要有模版就挂载
                // 这里需要对象模版进行编译
                const render = compileToFunction(template)
                ops.render = render; //jsx 最终会被编译成h('xxx')
            }
        }
        mountComponent(vm, el); // 组件的挂载  
        // 最终就可以获取render方法
        // script 标签引用的vue.global.js 这个编译过程是在浏览器运行的
        // runtime是不包含模板编译的, 整个编译是打包的时候通过loader来转义.vue文件的, 用runtime的时候不能使用template
    }
}
