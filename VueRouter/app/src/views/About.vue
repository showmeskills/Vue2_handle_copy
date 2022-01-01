<template>
  <div class="about">
     <div>
      <router-link to="/about/a">切A</router-link> |
      <router-link to="/about/b">切B</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>

export default{
  mounted(){
    console.log(this.$router)
  }
}

</script>
