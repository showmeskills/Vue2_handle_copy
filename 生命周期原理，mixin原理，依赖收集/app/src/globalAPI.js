import {
    mergeOptions
} from "./utils"

export function initGlobalAPI(vue) {
    
    vue.options = {};
    vue.mixin = function (mixin) {
        //我们期望将用户的选项和全局的options进行合并, 下面的样子
        //{} {created:function(){}} => {created:[fn]} 第一次
        //{created:[fn]} {created:function(){}} => {created:[fn,fn]} 第二次
        this.options = mergeOptions(this.options, mixin);
        return this;
    }
}