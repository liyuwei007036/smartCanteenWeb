<template>
  <el-row class="tac">
    <el-col :span="24">
      <el-menu class="el-menu-vertical-demo" unique-opened @open="handleOpen" @close="handleClose"
        background-color="#101634" text-color="#fff" active-text-color="#2E6CFE">
        <el-submenu v-for="item in menu" :index="item.id" :key="item.id">
          <template slot="title">
            <span v-text="item.name"></span>
          </template>
          <el-menu-item-group class="over-hide" v-for="sub in item.sub" :key="sub.componentName">
            <el-menu-item :index="sub.componentName"
            v-text="sub.name" @click="click(sub.componentName)">
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-col>
  </el-row>
</template>
<style scoped>

  .over-hide {
    overflow: hidden;
  }

  .el-menu{
    border-right: none;
  }

</style>
<script>
import menu from '@/config/menu-config';

export default {
  data() {
    return {
      menu,
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    click(name) {
      console.log(name);
      console.log(this);
      this.$router.push(name);
    },
  },
};
</script>
