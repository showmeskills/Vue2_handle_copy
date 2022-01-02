export default {
    functional:true,
    render(h,{parent,data}){
        //默认先渲染app.vue中的router-view
        //在渲染about中router-view
        //层级渲染 在父亲上是否有router-view的属性
        //1.app.vue [0] 是router-view
        //2.home.vue [1] 是router-view
        //3.a.vue [2] 是router-view
        data.routerView = true;
        let route = parent.$route;
        let depth = 0;
        while(parent){ 
            //_vnode 对应的是组件渲染函数中的虚拟节点 $vnode 代表的是home组件本身
            //$vnode 是_vnode 的父亲
            if(parent.$vnode && parent.$vnode.data.routerView){
                depth++;
            }
            parent = parent.$parent
        }
        let record = route.matched[depth];
        if(!record) { //没有匹配到组件直接return
            return h()
        }
        return h(record.component,data)
    }
}