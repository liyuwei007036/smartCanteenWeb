<template>
    <div id="app">
        <router-view v-if="isRouterAlive"></router-view>
    </div>
</template>
<script>
    export default {
        name: 'app',
        beforeCreate() {
            console.log('create');
        },
        provide() {
            return {
                reload: this.reload
            }
        },
        data() {
            return {
                isRouterAlive: true
            }
        },
        methods: {
            reload() {
                this.isRouterAlive = false
                this.$nextTick(() => {
                    this.isRouterAlive = true
                })
            }
        }
    };
</script>

<style>
    #app, .el-container {
        height: 100%;
    }

    .add-btn {
        background: #2E6CFE;
        border-radius: 15px;
        border-radius: 15px;
        height: 30px;
        font-size: 12px;
        padding: 0px 20px;
        font-weight: normal;
    }

    .search-btn {

    }

    .del-btn {
        background: #fff;
        border: 1px solid #DE302E;
        color: #DE302E;
        border-radius: 15px;
        border-radius: 15px;
        height: 30px;
        font-size: 12px;
        padding: 0px 20px;
        font-weight: normal;
    }

    .search-btn {
        background: #2E6CFE;
        height: 30px;
        width: 30px;
        text-align: center;
        padding: 0;
    }

    .search-input {
        height: 30px;
        font-size: 14px;
    }

    .option-menu{
        margin: 0px 0 15px;
    }
</style>

