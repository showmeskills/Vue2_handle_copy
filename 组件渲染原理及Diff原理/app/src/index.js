import { compileToFunction } from "./compiler";
import { initGlobalAPI } from "./globalAPI";
import {
    initMixin
} from "./init"
import {
    initLifeCycle
} from './lifecycle';
import { initStateMixin } from "./state";
import { createElm,patch } from './vdom/path';
//将所有的方法耦合在一起
function Vue(options) { //options 就是用户的选项
    this._init(options)
}

//最终调用都是这个方法
initMixin(Vue)
initLifeCycle(Vue);
initGlobalAPI(Vue);
initStateMixin(Vue)


// ------------- 为了方便观察前后的虚拟节点-- 测试的-----------------

// let render1 = compileToFunction(`<ul style="color:blue">
//     <li key="a">a</li>
//     <li key="b">b</li>
//     <li key="c">c</li>
//     <li key="d">d</li>
// </ul>`);
// let vm1 = new Vue({ data: { name: 'zf' } })
// let prevVnode = render1.call(vm1)

// let el = createElm(prevVnode);
// document.body.appendChild(el)



// let render2 = compileToFunction(`<ul  style="color:red;">
//     <li key="b">b</li>
//     <li key="m">m</li>
//     <li key="a">a</li>
//     <li key="p">p</li>
//     <li key="c">c</li>
//     <li key="q">q</li>
// </ul>`);
// let vm2 = new Vue({ data: { name: 'zf' } })
// let nextVnode = render2.call(vm2);


// 直接将新的节点替换掉了老的，  不是直接替换 而是比较两个人的区别之后在替换.  diff算法
// diff算法是一个平级比较的过程 父亲和父亲比对， 儿子和儿子比对 

// setTimeout(() => {
//     patch(prevVnode, nextVnode)


//     // let newEl = createElm(nextVnode);
//     // el.parentNode.replaceChild(newEl,el)
// }, 1000)



export default Vue