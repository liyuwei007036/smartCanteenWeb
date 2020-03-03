<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: 'app',
  beforeCreate() {
    console.log('create');
  },
};
</script>

<style>
#app,.el-container{
  height: 100%;
}
</style>
