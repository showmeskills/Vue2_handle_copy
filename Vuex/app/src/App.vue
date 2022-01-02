<template>
  <div id="app">
    {{$store.state.app}}
      <!-- {{$store.getters.getApp}} -->
      <h1 @click="$store.commit('add',5)">Change</h1>
      <h2 @click="$store.dispatch('addA',10)">ChangeA</h2>
      <!-- <h1>a:{{$store.state.a.age}}</h1>
      <h1>a getters:{{$store.getters['a/myAge']}}</h1>
      <h1>c:{{$store.state.c.age}}</h1> -->

  </div>
</template>

<script>

function mapState(stateList){
  let obj = {}
  for(let i = 0; i < stateList.length; i++){
    let stateKey = stateList[i]
    obj[stateKey] = function(){
      return this.$store.state[stateKey]
    }
  }
  return obj;
}
function mapActions(actionsList){
let obj = {}
  for(let i = 0; i < actionsList.length; i++){
    let actionKey = actionsList[i]
    obj[actionKey] = function(payload){
      return this.$store.dispatch(actionKey,payload)
    }
  }
  return obj;
}
export default {
  name: 'App',
  mounted(){
    console.log(this.$store.state.app)
  },
  // methods:{
  //   ...mapActions(['add'])
  // },
  // computed:{
  //   ...mapState(["app"]),

  // }
}
</script>

<style>

</style>
