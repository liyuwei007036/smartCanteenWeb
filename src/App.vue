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
    #app, html, body {
        height: 100%;
        padding: 0;
        margin: 0;
    }

    .search {
        margin-bottom: 20px;
    }

    .search .search_input {
        width: 25%;
        margin: 0 20px 0 0;
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
        border-radius: 50%;
        text-align: center;
        padding: 0;
    }

    .search-input {
        height: 30px;
        font-size: 14px;
    }

    .option-menu {
        margin: 0px 0 15px;
    }

    .delete-btn, .delete-btn:focus {
        color: #DE302E;
    }

    .delete-btn:hover {
        color: #ff302e;
    }

    .el-table td, .el-table th {
        padding: 5px 0;
    }

    .clearfix:after {
        content: '\20';
        display: block;
        clear: both;
        height: 0;

    }

    /*.el-dialog__body input[readonly] {*/
    /*    background-color: #f1f1f5*/
    /*}*/


    .el-dialog__body .el-date-editor.el-input, .el-date-editor.el-input__inner {
        width: 100%;
    }


    .select_normal {
        width: 100%;
    }
</style>

