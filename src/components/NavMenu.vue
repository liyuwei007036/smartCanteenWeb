<template>
    <el-row class="tac">
        <el-col :span="24">
            <el-menu class="el-menu-vertical-demo" unique-opened @open="handleOpen" @close="handleClose"
                     background-color="#101634" text-color="#fff" active-text-color="#2E6CFE"
                     :default-active="currentMenu">
                <el-submenu v-for="item in menu" :index="item.id" :key="item.id" v-acl="item.auths"
                            style="border-bottom: rgb(23,31,69) solid 2px">
                    <template slot="title">
                        <i :class="item.icon"/>
                        <span v-text="item.name"/>
                    </template>
                    <el-menu-item-group class="over-hide" v-for="sub in item.sub" :key="sub.componentName"
                                        v-acl="sub.auths">
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
