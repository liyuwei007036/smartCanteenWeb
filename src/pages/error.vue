<template>
    <div class="http404">
        <div class="pic-404">
            <el-image :src="require('@/assets/404.png')"/>
        </div>
        <div class="bullshit">
            <div class="bullshit__oops">对不起!</div>

            <div class="bullshit__headline">您输入的地址有误
            </div>
            <div class="bullshit__info">请检查您输入的链接地址
            </div>
            <a href="/" class="bullshit__return-home">返回首页</a></div>
    </div>
</template>

<script>
    export default {
        name: "error"
    }
</script>

<style scoped>
    .http404 {
        padding: 80px 50px;
        display: -webkit-flex;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .pic-404 {
        position: relative;
        float: left;
        width: 600px;
        overflow: hidden;
    }

    .http404 .bullshit {
        position: relative;
        float: left;
        width: 300px;
        padding: 30px 0;
        overflow: hidden;
    }

    .bullshit__oops {
        font-weight: 700;
        font-size: 32px;
        line-height: 40px;
        color: #1482f0;
        margin-bottom: 20px;
    }

    .http404 .bullshit__info {
        font-size: 13px;
        line-height: 21px;
        color: grey;
        margin-bottom: 30px;
    }

    .http404 .bullshit__return-home {
        display: block;
        float: left;
        width: 110px;
        height: 36px;
        background: #1482f0;
        border-radius: 100px;
        text-align: center;
        color: #fff;
        font-size: 14px;
        line-height: 36px;
        cursor: pointer;
    }
</style>