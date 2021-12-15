
import Dep from './dep';

/**
 * 
 * 当我们创建渲染wathcer 的时候我会把当前的渲染wathcer放到Dep.target上
 * 调用_render()会取值 走到get上
 */
let id = 0;
//每个属性有一个dep (属性就是被观察者),watcher就是观察者(属性变化了就会通知观察者来更新)
class Watcher{ //不同的组件有不同的watcher 目前只有一个 渲染根实例
    constructor(vm,fn,options){
        this.id = id++;
        this.renderWatcher = options;
        this.getter = fn; //getter 调用这个函数可以发生取值操作
        this.deps = []; //后续我们实现计算属性，和一些清理工作需要用到
        this.depsId = new Set();
        this.get()
    }
    addDep(dep){//一个组件对应着多个属性 重复的属性也不用记录
        let id = dep.id;
        if(!this.depsId.has(id)){
            this.deps.push(dep);
            this.depsId.add(id)
            dep.addSub(this); //watcher 已经记住了dep了而且去重了，此时让dep也记住watcher
        }
    }
    get(){
        Dep.target = this;//静态属性就是只有一份 在这个给组件赋值;this 就是渲染谁就是指谁
        this.getter(); //会去vm上取值 vm._update(vm._render()) 取挂在的变量
        Dep.target = null;//渲染完毕后清空
    }
    update(){
        //this.get()//重新渲染
        //把所有watcher 放到队伍里面然后集体更新
        queueWatcher(this)
    }
    run(){
        this.get();
    }
}
let queue = [];
let has = {}; //去重watcher
let pending = false;//防抖

function flushSchedulerQueue(){
    let flushQueue =  queue.slice(0);
    queue = [];
    has = {};
    pending = false;
    flushQueue.forEach(q=>q.run());
}

function queueWatcher(watcher){
    const id = watcher.id;
    if(!has[id]){ // 一个模版上(是同一个watcher)一次更新多个属性，id值是一样的，所以只能进来第一次
        queue.push(watcher)
        has[id] = true;
        //当有多个组件需要更新
        //不管Watcher 中的 update 执行多少次,但是最终只执行一轮刷新
        if(!pending){
            nextTick(flushSchedulerQueue,0) //异步代码
            pending = true;
            //console.log("刷新1次")
        }
    }
}
let callbacks = [];
let waiting = false;
function flushCallbacks(){
    let cbs = callbacks.slice(0);//copy 一个份
    waiting = true;
    callbacks = [];
    cbs.forEach(cb=>cb());//按顺序执行
}


//nextTick  没有直接使用某个api 而是采用优雅降级的方法'
//内部先采用的是promise (ie不兼容) MutationObserver(h5(浏览器没有) api 也是异步) 可以考虑ie专项 setImmediate setTimeout
let timerFunc;
if(Promise){
    timerFunc = ()=>{
        Promise.resolve().then(flushCallbacks)
    }
}else if(MutationObserver){
    let observer = new MutationObserver(flushCallbacks); //这里传入的回调是异步执行的
    let textNode = document.createTextNode(1);
    observer.observe(textNode,{
        characterData:true
    })
    timerFunc = () =>{
        textNode.textContent = 2;
    }
}else if(setImmediate){
    timerFunc = ()=>{
        setImmediate(flushCallbacks)
    }
}else{
    setTimeout(flushCallbacks)
}

export function nextTick(cb){//先内部还是先用户
    callbacks.push(cb); //维护nextTick中的callback 方法
    if(!waiting){
        timerFunc();//最后一起更新
        waiting = true;
    }
}
//需要给每个属性增加一个dep，目的就是收集watcher
//一个视图中 有多少个属性(n个属性对应一个视图) n个dep对应一个watcher
//1个属性可以对应多个组件 1个dep对应多个watcher
//多对多的关系

export default Watcher;