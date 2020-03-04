<template>
    <div class="demonstration">
        <el-image :src="require('@/assets/header-icon.png')" class="header-img"/>
        <span class="user-name">欢迎您：admin</span>&nbsp;| &nbsp;
        <span style="color: #777">修改密码</span>&nbsp;| &nbsp;
        <span style="color: #777">安全退出</span>
    </div>
</template>
<script>
    export default {}
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
