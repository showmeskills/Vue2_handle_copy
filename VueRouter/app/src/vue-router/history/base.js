//公共方法

function createRoute(record, location) {
    let matched = [];
    if (record) {
        while(record){
            matched.unshift(record);// [about,about/a]
            record = record.parent;
        }
    }
    return {
        ...location,
        matched
    }
}

function runQueue(queue,from,to,cb){
    function next(index){
        if(index > queue.length) return cb();

        let hook = queue[index];
        hook(from,to,()=>next(index+1))
    }
    next(0)
}

class Base {
    constructor(router) {
        this.router = router;

        this.current = createRoute(null, {
            path: "/",
            match: []
        })
    }
    //所有的逻辑都要放在TransitionTo来实现
    transitionTo(location, listener) {
        let record = this.router.match(location)
        //如果当路由切换的时候 也应该调用transitionTo方法 再次拿到新的记录
        //一个组件渲染到外层，一个组件渲染到内层
        //path: "/" matched:[]
        //path: "/about/a",matched:[aboutRecord,aboutARecord]
        let route = createRoute(record, {
            path: location
        })
        //防止反复匹配; 当前跳转的路径和我们之前存的一样，而且匹配结果也一样则不再发生跳转
        if(location == this.current.path && route.matched.length == this.current.matched.length){
            return;
        }

        let queue = [].concat(this.router.beforeEachHooks) //多个钩子可以叠戴一起
        
        runQueue(queue,this.current,route,()=>{
            this.current = route;
            //console.log(this.current)//每次更新current后 页面会发变化,
            //使用Vue watch 定义成响应式
    
            //console.log(record) // /about/b = /about + /b 需要根基匹配的纪律找到所有的组件 根据组件渲染到不同的routerview中
            
            listener && listener();
            this.cb &&this.cb(route);
        })
    }
    listen(cb){//自定义一个钩子 this._route = route
        this.cb = cb;
    }
}

export default Base;