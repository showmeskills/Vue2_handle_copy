import Base from "./base"

class BrowserHistory extends Base{
    constructor(router){
        super(router)
    }
    setupListener(){ //稍后需要调用此方法 监控hash值
        window.addEventListener('popstate',function(){
            window.location.pathname
        })
    }
    getCurrentLocation(){
        return window.location.pathname
    }
}
export default BrowserHistory