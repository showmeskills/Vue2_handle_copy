
import { createElementVNode,createTextNode } from './vdom/index';
import Watcher from './observe/watcher';


function createElm(vnode){
    let {tag,data,children,text} = vnode;
    if(typeof tag === "string"){//标签
        vnode.el = document.createElement(tag); //将真实节点和虚拟节点对应起来,后续如果需要修改属性
        patchProps(vnode.el,data);
        children.forEach(child=>vnode.el.appendChild(createElm(child)))
    }else{
        vnode.el = document.createTextNode(text);
    }
    return vnode.el;
}
function patchProps(el,props){
    for(let key in props){
        if(key === "style"){
            for (let styleName in props.style){
                el.style[styleName] = props.style[styleName]
            }
        }else{
            el.setAttribute(key,props[key])
        }
    }
}
function patch(oldVnode,vnode){
    //写的是初渲染流程
    const isRealElement = oldVnode.nodeType; //如果nodeType返回值的话就是一个真实元素

    if(isRealElement){
        const elm = oldVnode;//获取真实元素
        const parentElm = elm.parentNode;//拿到父元素
        let newElm = createElm(vnode)
        // console.log(newElement)
        //需要把新节点插入在老节点之前，然后删除掉
        parentElm.insertBefore(newElm,elm.nextSibling)
        parentElm.removeChild(elm);
        return newElm
    }else{
        //diff 算法
    }
}

export function initLifeCycle(Vue){
    Vue.prototype._update = function(vnode){ //将vnode转化成真实DOM
        //console.log('update')
        //patch 既有初始化功能又有更新的逻辑
        const vm = this;
        const el = vm.$el;
        vm.$el = patch(el,vnode);
    }
    //_c('div',{},...children)
    Vue.prototype._c = function (){
       return createElementVNode(this,...arguments)
    }
    //_v(text)
    Vue.prototype._v = function(){
        return createTextNode(this,...arguments)
    }
    Vue.prototype._s = function(value){
        if(typeof value === 'object') return value;
        return JSON.stringify(value)
    }
    Vue.prototype._render = function(){
        //让with中的this指向vm
        //当渲染的时候回去实例中取值，我们就可以将属性和试图绑定在一起
        return this.$options.render.call(this);//通过ast语法转义后生成的render方法
    }
}

export function mountComponent(vm,el){//这里的el 是通过querySelector处理过的
    vm.$el = el;
    // 1.调用render方法产生虚拟节点 虚拟DOM

    const updateComponent =()=>{
        vm._update(vm._render()); // vm.$options.render() 返回虚拟节点; vm._update 将虚拟节点转为真实节点
    }
    // 渲染的时候创建一个观察者模式
    new Watcher(vm,updateComponent,true) //true是标识是一个渲染watcher

    // 2.根据虚拟DOM产生真实DOM 


    // 3.插入到el元素中

}
// vue核心流程 1） 创造了响应式数据  2） 模板转换成ast语法树  
// 3) 将ast语法树转换了render函数 4) 后续每次数据更新可以只执行render函数 (无需再次执行ast转化的过程)
// render函数会去产生虚拟节点（使用响应式数据）
// 根据生成的虚拟节点创造真实的DOM

export function callHook(vm,hook){
    const handlers = vm.$options[hook];
    if(handlers){
        handlers.forEach(handler=>handler.call(vm));
    } 
}