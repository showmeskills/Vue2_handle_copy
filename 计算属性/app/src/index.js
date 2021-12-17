import { initGlobalAPI } from "./globalAPI";
import {
    initMixin
} from "./init"
import {
    initLifeCycle
} from './lifecycle';
import Watcher, {
    nextTick
} from "./observe/watcher";
//将所有的方法耦合在一起
function Vue(options) { //options 就是用户的选项
    this._init(options)
}
Vue.prototype.$nextTick = nextTick;
//最终调用都是这个方法
initMixin(Vue)
initLifeCycle(Vue);
initGlobalAPI(Vue);
Vue.prototype.$watch = function (exprOrFn,cb){
    //expressOrFn -> string or ()=>string
    new Watcher(this,exprOrFn,{user:true},cb)
}
export default Vue