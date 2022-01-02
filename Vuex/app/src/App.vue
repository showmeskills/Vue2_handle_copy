<template>
  <div id="app">
    {{$store.state.app}}<br/>
      <!-- 
      {{$store.getters.getApp}}
      <h1 @click="$store.commit('add',5)">Change</h1>
      <h2 @click="$store.dispatch('addA',10)">ChangeA</h2>
      <h1>a:{{$store.state.a.age}}</h1>
      <h1>a getters:{{$store.getters['a/myAge']}}</h1>
      <h1>c:{{$store.state.c.age}}</h1> -->

  </div>
</template>

<script>


export default {
  name: 'App',
}
</script>

<style>

</style>
