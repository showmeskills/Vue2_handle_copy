import install, { Vue } from "./install";
import createMatcher from "./create-matcher";
import HashHistory from "./history/hash";
import BrowserHistory from "./history/history";

class VueRouter{
    constructor(options){
        //用户传递的路由配置，我们可以对这个配置进行一个路由映射
        let routes = options.routes || [];
        //将routes 映射表{'/':Home,'/a':HomeA,'/b':HomeB,'/about':About}
        //方便后续的匹配,也可以添加新的方法
        this.mathcer = createMatcher(routes);

        //根据不同的模式创建对应的路由系统
        let mode = options.mode || "hash";
        if(mode === 'hash'){
            this.history = new HashHistory(this); // hashchange
        }else if(mode === 'history'){
            this.history = new BrowserHistory(this); //popstate
        }
    }
    match(location){
        return this.mathcer.match(location)
    }
    push(location){
        this.history.transitionTo(location)
    }
    init(app){
        let history = this.history;
        //根据路径变化和对应的组件进行渲染,路径变化了需要更新试图 (响应式)
        //我们需要先根据路径进行(首次)匹配组件来渲染，然后之后来监听
        history.transitionTo(history.getCurrentLocation(),()=>{
            history.setupListener();// 监听路由的变化
        })
    }
}




//需要将用户的配置进行映射
//要将根实例注入的router属性共享给每个组件


// 为什么要多发明一个install 方法，原因用户导出一个类，在类上写一个install方法，会优先执行install
VueRouter.install = install
export default VueRouter;