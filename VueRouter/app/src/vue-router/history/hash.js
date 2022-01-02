import Base from "./base"


function ensureSlash(){
    if(window.location.hash){
        return;
    }
    window.location.hash="/";//没有hash 默认一个 /
}
function getHash(){
    return window.location.hash.slice(1);
}
class HashHistory extends Base{
    constructor(router){
        super(router)
         //初始化hash路由的时候 要给定一个默认的hash路径
         ensureSlash()
    }
    setupListener(){ //稍后需要调用此方法 监控hash值
        window.addEventListener('hashchange',()=>{
            //当hash值变化后需要更新url
            this.transitionTo(getHash())
        })
    }
    getCurrentLocation(){
        return getHash();
    }
    push(location){
        this.history.transitionTo(location,()=>{
            window.location.hash = location
       })
    }
}


export default HashHistory