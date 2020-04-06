<template>
    <div id="app">
        <router-view v-if="isRouterAlive"/>
    </div>
</template>
<script>
    import {SOCKET_URL} from './config/global.js'

    export default {
        name: 'app',
        beforeCreate() {
            if (process.env.NODE_ENV !== 'development') {
                //禁用右键（防止右键查看源代码）
                window.oncontextmenu = function () {
                    return false;
                }
                // //禁止任何键盘敲击事件（防止F12和shift+ctrl+i调起开发者工具）
                // window.onkeydown = window.onkeyup = window.onkeypress = function () {
                //     window.event.returnValue = false;
                //     return false;
                // }
            }
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
        created() {
            this.localSocket()
        },
        methods: {
            dis() {

            },
            reload() {
                this.isRouterAlive = false
                this.$nextTick(() => {
                    this.isRouterAlive = true
                })
            },
            localSocket() {
                let that = this
                console.log(SOCKET_URL)
                if (typeof (WebSocket) == "function") {
                    const wsUri = SOCKET_URL + sessionStorage.getItem('x-smart-token') || 'x'
                    that.ws = new WebSocket(wsUri);
                    that.ws.onOpen = function () {
                        console.log('开启webSocket')
                    }
                    that.ws.onClose = function () {
                        console.log('onClose webSocket')
                    }
                    that.ws.onerror = function () {
                        console.log('onError webSocket')
                        that.localSocket();
                    }
                    that.socket.setWs(that.ws);
                } else {
                    that.$message.error('您的浏览器不支持websocket')
                }
            },
        }
    };
</script>

<style>
    #app, html, body {
        height: 100%;
        padding: 0;
        margin: 0;
    }

    .el-table tbody tr:hover > td {
        background-color: #C7C9E1 !important
    }

    /*重写搜索样式*/
    .search {
        margin-bottom: 20px;
        border-bottom: 1px solid #5286FF;
        padding-bottom: 20px;
    }

    .search .search_input {
        margin: 0 20px 0 0;
    }

    .search-row {
        padding: 10px 0
    }

    .search-grid-content {
        display: flex;
        align-items: center
    }

    .search-label {
        display: inline-block;
        width: 115px;
        font-size: 14px;
    }

    .add-btn {
        background: #2E6CFE;
        border-radius: 15px;
        height: 30px;
        font-size: 12px;
        padding: 0px 20px;
        font-weight: normal;
    }

    .add-btn, .add-btn:focus {
        background: #2E6CFE;
    }

    .add-btn:hover {
        background: #2d6bf7;
    }

    .dialog-btn-normal {
        background: #5EAFF7 !important;
        color: #FFFFFF !important;
        height: 30px;
        width: 100px;
        line-height: 30px;
        padding: 0;
        font-size: 13px;
    }

    .dialog-btn-normal:hover, .dialog-btn-normal:focus {
        background: #2E6CFE !important;
        color: #FFFFFF !important;
    }

    .dialog-btn-reset {
        background: #ffffff !important;
        border: 1px solid #5EAFF7;
        color: #5EAFF7 !important;
        height: 30px;
        width: 100px;
        line-height: 30px;
        padding: 0;
        font-size: 13px;
    }

    .dialog-btn-reset:hover, .dialog-btn-reset:focus {
        background: #F1F1F1 !important;
        border: 1px solid #5EAFF7;
    }

    .del-btn {
        background: #fff;
        border: 1px solid #DE302E;
        color: #DE302E;
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
        border: none;
        border-radius: 0;
        text-align: center;
        padding: 0;
    }

    .search-btn, .search-btn:focus {
        background: #2E6CFE;
    }

    .search-btn:hover {
        background: #2d6bf7;
    }

    .search-btn-primary {
        background: #2E6CFE;
        height: 34px;
        width: 87px;
        border: none;
        border-radius: 5px;
        text-align: center;
        padding: 0;
    }

    .search-btn-primary:focus {
        background: #2E6CFE;
    }

    .search-btn-primary:hover {
        background: #2d6bf7;
    }

    .search-input {
        height: 30px;
        font-size: 14px;
    }

    .option-menu {
        margin: 20px 0 20px;
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

    .dialog {
        text-align: center;
    }

    .dialog .el-dialog__footer {
        text-align: center;
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

    /*重置dialog样式*/
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
        padding: 10px 40px 0 10px;
    }

    .abow_dialog .el-dialog {
        margin: 0 auto !important;
        height: 90%;
        /*overflow: hidden;*/
    }

    .el-input__inner {
        height: 34px;
        line-height: 34px;
        border: 1px solid #d5d5d5;
    }

    .el-input__inner:focus {
        border: 1px solid #5286FF;
    }

    .el-input__icon {
        line-height: 34px;
    }

    .el-dialog__header {
        color: #fff;
        background-color: #4D7DFF;
        text-align: center;
        font-size: 16px;
        height: 41px;
        line-height: 41px;
        padding: 0;
        position: relative;
    }

    .el-dialog__title {
        color: #fff;
    }

    .el-dialog__headerbtn .el-dialog__close {
        color: #fff;
        font-size: 23px;
    }

    .el-dialog__headerbtn {
        position: absolute;
        top: 50%;
        margin-top: -10px;
        right: 15px;
    }

    .el-form-item__label {
        color: #2F332A;
    }


    /*滚动条的宽度*/
    ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }


    /*滚动条的滑块*/
    ::-webkit-scrollbar-thumb {
        background-color: #5286FF;
        border-radius: 3px;
    }

    .el-dialog__footer {
        border-top: 1px solid #eee;
        padding: 20px;
    }

    .dialog-footer {
        display: flex;
        justify-content: space-around;
    }

    .el-tooltip__popper {
        max-width: 20%;
    }

    /deep/ .el-dialog {
        display: flex;
        flex-direction: column;
        margin: 0 !important;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        /*height:600px;*/
        max-height: calc(100% - 30px);
        max-width: calc(100% - 30px);
    }
</style>

