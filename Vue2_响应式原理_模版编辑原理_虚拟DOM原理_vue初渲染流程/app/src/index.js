import {initMixin} from "./init"
import { initLifeCycle } from './lifecycle';
//将所有的方法耦合在一起
function Vue(options){ //options 就是用户的选项
    this._init(options)
}
initMixin(Vue)
initLifeCycle(Vue);
export default Vue