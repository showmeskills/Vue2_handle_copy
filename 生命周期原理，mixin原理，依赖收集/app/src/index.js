import { initGlobalAPI } from "./globalAPI";
import {
    initMixin
} from "./init"
import {
    initLifeCycle
} from './lifecycle';
import {
    nextTick
} from "./observe/watcher";
//将所有的方法耦合在一起
function Vue(options) { //options 就是用户的选项
    this._init(options)
}
Vue.prototype.$nextTick = nextTick;
initMixin(Vue)
initLifeCycle(Vue);
initGlobalAPI(Vue);

export default Vue