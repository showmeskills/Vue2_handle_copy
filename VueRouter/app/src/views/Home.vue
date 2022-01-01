<template>
  <div class="home">
    <div>
      <router-link to="/a">切A</router-link> |
      <router-link to="/b">切B</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "Home",
  components: {},
};
</script>
