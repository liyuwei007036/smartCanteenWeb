<template>
    <div id="app">
        <router-view v-if="isRouterAlive"/>
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

    .el-table--striped .el-table__body tr.el-table__row--striped.current-row td, .el-table__body tr.current-row > td, .el-table__body tr.hover-row.current-row > td, .el-table__body tr.hover-row.el-table__row--striped.current-row > td, .el-table__body tr.hover-row.el-table__row--striped > td, .el-table__body tr.hover-row > td {
        background-color: #aecaff
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

    .green-btn, .green-btn:focus {
        color: #67C23A;
    }

    .green-btn:hover {
        color: #71ca38;
    }

    .warning-btn, .warning-btn:focus {
        color: #E6A23C;
    }

    .warning-btn:hover {
        color: #E6A23C;
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

    .dialog .el-dialog__body input[readonly] {
        background-color: #f1f1f5
    }


    .el-dialog__body .el-date-editor.el-input, .el-date-editor.el-input__inner {
        width: 100%;
    }


    .select_normal {
        width: 100%;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none !important;
        margin: 0;
    }

    input[type="number"] {
        -moz-appearance: textfield;
    }

    .abow_dialog {
        display: flex;
        justify-content: center;
        align-items: Center;
        overflow: hidden;
    }

    .abow_dialog .el-dialog__body {
        position: absolute;
        left: 0;
        top: 54px;
        bottom: 0;
        right: 0;
        z-index: 1;
        overflow: hidden;
        overflow-y: auto;
        text-align: center;
    }

    .abow_dialog .el-dialog {
        margin: 0 auto !important;
        height: 90%;
        /*overflow: hidden;*/
    }
</style>

