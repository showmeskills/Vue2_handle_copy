
export default {
    props:{
        to:{
            type:String,
            require:true,
        },
        tag:{
            type:String,
            default:"a"
        }
    },  
    methods:{
        handler(){
            this.$router.push(this.to)
        }
    },
    render(){
        // this.$scopeSlots.default()
        let tag = this.tag ;
        return <tag onClick={this.handler}>{this.$slots.default}</tag>
    }
}