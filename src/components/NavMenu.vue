<template>
    <el-row class="tac">
        <el-col :span="24">
            <div style="color: #ffffff;height: 60px;display: flex;align-items: center;justify-content: center;border-bottom: 1px solid #101634;font-size:14px;font-weight: bold">
                <el-image :src="require('@/assets/logo.png')" style="width: 36px;height: 25px;padding-right: 5px"/>
                <span>Duomo</span>
            </div>
            <el-menu class="el-menu-vertical-demo" unique-opened @open="handleOpen" @close="handleClose"
                     background-color="#171F45" text-color="#fff" active-text-color="#2E6CFE"
                     :default-active="currentMenu">
                <el-submenu v-for="item in menu" :index="item.id" :key="item.id" v-acl="item.auths"
                            style="border-bottom: #101634 solid 1px">
                    <template slot="title">
                        <i :class="item.icon"/>
                        <span v-text="item.name"/>
                    </template>
                    <el-menu-item-group class="over-hide" v-for="sub in item.sub" :key="sub.componentName"
                                        v-acl="sub.auths">
                        <el-menu-item :index="sub.componentName" style="background-color: #101634"
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

    .el-menu {
        border-right: none;
    }

</style>
<script>
    import menu from '@/config/menu-config';

    export default {
        data() {
            return {
                menu,
                currentMenu: this.$route.name,
            };
        },
        methods: {
            handleOpen(key, keyPath) {
            },
            handleClose(key, keyPath) {
            },
            click(name) {
                if (this.$route.name !== name) {
                    this.$router.push(name)
                }
            },
        },
    };
</script>
<style>
    .el-menu-item {
        background-color: #101634 !important;
    }

    .el-menu-item-group__title {
        padding: 0 0 0 20px;
    }

    .el-menu-item:hover, .el-submenu__title:hover {
        background-color: #476086 !important;
    }

    .el-menu-item:focus {
        background-color: #101634 !important;
    }
</style>
