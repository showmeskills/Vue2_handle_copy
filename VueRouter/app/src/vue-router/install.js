import routerLink from "./components/router-link";
import routerView from "./components/router-view";

export let Vue;

function install (_Vue){
    Vue = _Vue; //将传入的Vue的构造函数是全局的
    // Vue.prototype.$router 有个致命的缺点就是，
    // 当有2个Vue实例的时候，一个new Vue中引入routes而另一个new Vue中没有引入这样会导致无法共享$router

    Vue.mixin({ //mergeOptions 所有组件出话都会采用这个方法
        beforeCreate() {
            //this.$router = this.$options?.router 意思是有router才加没有router不加;

            //父 加_router, 子找到父的_router, 孙子也父拿_router
            //组件渲染是从父到子
            if(this.$options.router){
                //根实例上传递了router
                this._routerRoot = this; //根实例
                this._router = this.$options.router;
                this._router.init(this);//this 就整个应用 new Vue
                //给更实例添加一个属性 _route就是当前的current对象; 作为响应式属性
                Vue.util.defineReactive(this,'_route',this._router.history.current)
                //改变的是current两个不是一个对象，内部的是current我们需要改变这个_route

                //this._router 拿到根实例
                //this._route 拿到current对象

            }else{
                //有父组件就往父组件中寻找
                //在所有组件上都增加一个_routerRoot指向根实例
                this._routerRoot = this.$parent && this.$parent._routerRoot
            }
            //在组件中都可以通过 this._routerRoot._router
            //console.log(this._routerRoot._router);
        },
    })
    //组件添加 this.$router,做个代理
    Object.defineProperty(Vue.prototype,"$router",{
        get(){
            return this._routerRoot && this._routerRoot._router;
        }
    })
    // 定义成响应式
    Object.defineProperty(Vue.prototype,"$route",{ //所有组件都有一个$route属性 对应的就是我们
        get(){
            return this._routerRoot && this._routerRoot._route;
        }
    })
    Vue.component("router-link",routerLink)

    Vue.component("router-view",routerView)

}
export default install