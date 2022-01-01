//公共方法

class Base{
    constructor(router) {
        this.router = router;
    }
    //所有的逻辑都要放在TransitionTo来实现
    transitionTo(location,listener){
        let record = this.router.match(location)
        //如果当路由切换的时候 也应该调用transitionTo方法 再次拿到新的记录
        console.log(record)
        listener && listener()
    }
}

export default Base;