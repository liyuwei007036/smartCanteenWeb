<template>
    <div id="app" direction="horizontal">
        <el-container>
            <el-header class="header">
                <vheader/>
            </el-header>
            <el-container>
                <el-aside width="200px" class="menu">
                    <navmenu></navmenu>
                </el-aside>
                <el-main>
                  <breadcrumb></breadcrumb>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    import Header from '@/components/Header';
    import NavMenu from '@/components/NavMenu';
    import BreadCrumb from '@/components/breadcrumb';//面包屑

    export default {
        data() {
            return {
              breads:[],
            };
        },
        beforeCreate() {
            console.log('index');
        },
        components: {
            navmenu: NavMenu,
            vheader: Header,
            breadcrumb: BreadCrumb,
        },
        mounted() {
            this.goHome()
        },
        methods: {
            goHome() {
                if (this.$router.currentRoute.name === 'index') {
                    this.$router.push('/home')
                }
            }
        }
    };
</script>

<style>
    .header {
        background-color: #409EFF;
        color: #fff;
        line-height: 60px;
    }

    .menu {
        height: 100%;
        background-color: rgb(84, 92, 100);
    }
</style>
