
let id = 0;

class Dep{
    constructor(){
        this.id = id++;//属性的dep要收集watcher
        this.subs = []; //把属性对应的所有watcher
    }
    depend(){
        //当html 中有一个data属性重复写了好多次，需要去除 单向的关系 dep -> watcher
        //watcher dep
        //this.subs.push(Dep.target); 这样写法会重复读取html data的属性
        Dep.target.addDep(this);//让watcher 记录dep
        //dep 和 watcher 是一个多对多的关系(一个属性可以在多个组件使用,一个组件对应多个wathcer)
        //一个组件由多个属性组成 一个watcher对应多个dep
    }
    addSub(watcher){
        this.subs.push(watcher);
    }
    notify(){
        this.subs.forEach(watcher=>watcher.update())//告诉watcher 更新watcher 方法
    }
}

Dep.target = null; 

export default Dep;