<template>
    <el-row>
        <el-col :span="20">
            <div class="head-wrap">
                <el-image :src="require('@/assets/logo-lion.png')" class="logo"/>
                智慧食堂业务支撑系统
            </div>
        </el-col>
        <el-col :span="4">
            <div class="demonstration" style="color:white;float: right">
                  <span>
                    <i class="el-icon-user-solid"></i> admin
                  </span>
                <span>
              修改密码
            </span>
                <span>
              安全退出
            </span>
            </div>
        </el-col>
    </el-row>
</template>
<script>
    export default {

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

    .logo {
        width: 50px;
        height: 50px;
        margin-right: 10px;
    }
</style>
