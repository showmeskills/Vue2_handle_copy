export let Vue;

const install = (_Vue)=>{
    Vue = _Vue;
    
    Vue.mixin({
        beforeCreate() {
            if(this.$options.store){
                // means roote store
                this.$store = this.$options.store
            }else if(this.$parent && this.$parent.$store){
                this.$store = this.$parent.$store
            }
        },
    })
}

export default install;