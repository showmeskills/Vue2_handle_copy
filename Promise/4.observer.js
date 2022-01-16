// 被观察者类
class Subject {
    constructor(name) {
        this.name = name;
        this.observers = [];
        this.state = '开心'
    }
    attach(o) {
        this.observers.push(o); // 被观察者会收集所有的观察者
    }
    setState(newState) {
        this.state = newState;
        this.observers.forEach(o => o.update(this)); // 通知所有的观察者我发生了变化
    }
}
// 观察者类
class Observer {
    constructor(name) {
        this.name = name
    }
    update(s) {
        console.log(`我是${this.name}:当前宝宝的状态`, s.state)
    }
}
const baby = new Subject('小宝宝')
const m = new Observer('妈妈');
const f = new Observer('爸爸')
baby.attach(m);
baby.attach(f);
baby.setState('不开心')
setTimeout(()=>{
    baby.setState('开心了')
},1000)
// 我家有个小宝宝 自己的状态就是是否开心， 我和我媳妇要监控小宝宝的状态， 稍后小宝宝不开心了 会通知我们