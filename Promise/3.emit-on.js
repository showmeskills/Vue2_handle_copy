const fs = require('fs');
const path = require('path');
let events = {
    _events:[], // 如果events中存放的是promise compose
    on(cb){
        this._events.push(cb);
    },
    emit(...args){
        this._events.forEach(cb=>cb(...args))
    }
};
// 所谓的订阅就是把事情 存到一个列表中，每次发布将列表中的函数依次执行
events.on(function(key){ // 每次发布都执行以下此函数
  console.log('读取完毕了一次',key)
})
let school = {}
events.on(function(key,data){ // 每次发布都执行以下此函数
    school[key] = data;
    if(Object.keys(school).length === 2){
        console.log(school);
    }
})
fs.readFile(path.resolve(__dirname, 'name.txt'), 'utf8', function (err, data) {
    events.emit('name',data)
})
fs.readFile(path.resolve(__dirname, 'age.txt'), 'utf8', function (err, data) {
    events.emit('age',data)
})
// 观察者模式和发布订阅模式的区别
// 发布和订阅之间没有耦合关系， 什么时候发布是取决于自己的
// 观察者模式 观察者，被观察者。 如果被观察者发生了变化，会主动通知观察者去更新 （收集：被观察者要收集观察者）
// 观察者模式是包含发布订阅的