
const isReservedTag = (tag)=>{
    return ['div','p','a','ul','li','span','button'].includes(tag);
}

// h() _c()
export function createElementVNode(vm, tag, data, ...children) {
    data == null ? data ={} : data;
    let key = data.key;
    if(key) delete data.key;

    if(isReservedTag(tag)){
        return vnode(vm,tag,key,data,children)
    }else{
        //创造组件的虚拟节点 (包含组件的构造函数)
       let Ctor =  vm.$options.components[tag];//组件的构造函数
       //Ctor 就是组件的定义 可能是一个Sub类 还有可能是组件的obj选项
       return createComponentVnode(vm,tag,key,data,children,Ctor);
    }

}

function createComponentVnode(vm,tag,key,data,children,Ctor){
    if(typeof Ctor === 'object'){
       Ctor = vm.$options._base.extend(Ctor)
    }
    data.hook = {
        init(vnode){ // 稍后创造真实节点的时候 如果是组件则调用此init方法
            //保存组件的实例到虚拟节点上
            let instance = vnode.componentInstance =  new vnode.componentOptions.Ctor
            instance.$mount()
        }
    }
    return vnode(vm,tag,key,data,children,null,{Ctor})
}
// _v()
export function createTextNode(vm,text) {
    return vnode(vm,undefined,undefined,undefined,undefined,text)
}
// ast 做的是语法层面的转化，他描述的是语法本身
// 我们的虚拟dom是描述的dom元素，可以增加一些自定义属性
function vnode(vm, tag,key,data,children,text,componentOptions) {
    return {
        vm,
        tag,
        key,
        data,
        children,
        text,
        componentOptions //组件的构造函数
    }
}

export function isSameVnode(vnode1,vnode2){
    return vnode1.tag === vnode2.tag && vnode1.key === vnode2.key;
}