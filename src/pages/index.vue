<template>
    <div id="app" direction="horizontal">
        <el-container>
            <el-aside width="200px" class="menu">
                <div class="logo">
                    <el-image :src="require('@/assets/logo-lion.png')" class="logo-img"/>
                </div>
                <navmenu/>
            </el-aside>
            <el-container>
                <el-header class="header">
                    <vheader/>
                </el-header>
                <el-main>
                    <!--                    <div class="breadcrumb" style="margin-bottom: 10px;padding: 15px 20px">-->
                    <!--                        <breadcrumb></breadcrumb>-->
                    <!--                    </div>-->
                    <div class="main-content">
                        <router-view/>
                    </div>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    import Header from '@/components/Header';
    import NavMenu from '@/components/NavMenu';

    export default {
        data() {
            return {
                breads: [],
            };
        },
        beforeCreate() {
        },
        components: {
            navmenu: NavMenu,
            vheader: Header,
        },
        mounted() {
            this.goHome()
            console.log(this.$ViewportSize)
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
        background-color: #fff;
        color: #171F45;
        line-height: 60px;
    }

    .menu {
        height: 100%;
        background: #171F45;
    }

    .el-main {
        background: #F1F2F5;
    }

    .main-content {
        background: #FFFFFF;
        box-shadow: 0 0 6px 0 #DFDFDF;
        border-radius: 6px;
        padding: 15px 20px 30px;
    }

    .logo {
        height: 100px;
        display: -webkit-flex;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .logo-img {
        width: 40px;
        height: 40px;
    }

    .el-container {
        height: 100%;
    }


</style>
