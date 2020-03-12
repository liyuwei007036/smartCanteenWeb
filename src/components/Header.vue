<template>
    <div class="demonstration">
        <el-image :src="require('@/assets/header-icon.png')" class="header-img"/>
        <span class="user-name">欢迎您：{{user.name}}</span>&nbsp;| &nbsp;
        <span style="color: #777"  :style="{cursor:'pointer'}">修改密码</span>&nbsp;| &nbsp;
        <span style="color: #777" @click="out" :style="{cursor:'pointer'}">安全退出</span>
    </div>
</template>
<script>
    import router from "../router";
    import {loginOut} from "../api/login";

    export default {
        data() {
            return {
                user: this.getCurrentUser(),
            };
        },
        beforeCreate() {
        },
        methods: {
            async out() {
                let res = await loginOut()
                if (res) {
                    await router.push({
                        name: `login`
                    })
                    sessionStorage.clear()
                }
            },
            getCurrentUser() {
                try {
                    return JSON.parse(sessionStorage.getItem('user'))
                } catch (e) {
                    return {}
                }
            }
        }
    }
</script>
<style>
    html {
        height: 100%;
    }

    body {
        margin: 0;
        height: 100%;
    }

    .head-wrap {
        display: flex;
        align-items: center;
    }

    .demonstration {
        font-size: 14px;
        color: #333333;
        letter-spacing: 0;
        float: right;
        display: flex;
        align-items: center;
    }

    .header-img {
        width: 20px;
        height: 20px;
        margin-right: 10px;
    }


</style>
