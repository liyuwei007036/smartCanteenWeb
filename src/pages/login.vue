<template>
    <div class="login-container">
        <el-row type="flex" justify="center">
            <el-col class="login-form">
                <div class="login_header_bg">通服信息管理系统</div>
                <div style="background-color:#fff;padding: 25px 70px 30px 74px;border-bottom-left-radius: 10px;border-bottom-right-radius: 10px;text-align: center">
                    <el-form ref="loginForm" :model="loginForm" :rules="rules" label-width="55px" label-position="left"
                             hide-required-asterisk>
                        <el-form-item prop="account" label="用户名">
                            <el-input type="text" v-model="loginForm.account" auto-complete="off" class="login-input"
                                      placeholder="账号"></el-input>
                        </el-form-item>

                        <el-form-item prop="password" label="密码">
                            <el-input type="password" v-model="loginForm.password" auto-complete="off"
                                      class="login-input"
                                      placeholder="密码"></el-input>
                        </el-form-item>

                        <el-button class="login-btn" style="width:100%;" @click="handleSubmit('loginForm')">登录
                        </el-button>

                    </el-form>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {login} from '@/api/login'

    export default {
        name: "login",
        data() {
            return {
                loginForm: {
                    account: 'admin',
                    password: '123456',
                    code: 'aaa'
                },
                rules: {
                    account: [{required: true, message: '请输入账号', trigger: 'blur'}],
                    password: [{required: true, message: '请输入密码', trigger: 'blur'}]
                },
            }
        },
        methods: {
            async login() {
                let res = await login(this.loginForm);
                if (res.code === 1000) {
                    sessionStorage.setItem("user", JSON.stringify(res.data))
                    this.$message.success('登录成功');
                    this.$router.push({path: 'index'})
                }
            },

            handleSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.login()
                    } else {
                        this.$message.error('账号或密码错误');
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .login-form {
        width: 382px;
        height: 320px;
    }

    .login-input /deep/ .el-input__inner {
        background-color: #f2f2f2;
        height: 32px;
        line-height: 32px;
        border-radius: 4px;
        border: none;
    }

    .login-container {
        min-height: 100%;
        width: 100%;
        background: url("../assets/login_bg.png");
        background-size: cover;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .login_header_bg {
        background: url("../assets/login_header_bg.png");
        background-size: cover;
        height: 105px;
        line-height: 105px;
        text-align: center;
        font-size: 22px;
        color: #fff;
        letter-spacing: 0;
    }

    .login-btn {
        background-image: linear-gradient(270deg, #2E6CFE 0%, #5185FF 100%);
        border-radius: 4px;
        font-size: 18px;
        color: #FFFFFF;
        letter-spacing: 0;
        text-align: center;
        width: 160px !important;
        height: 40px;
        margin: 25px 0 0;
    }

    .el-form-item__content {
        margin: 0 auto;
    }
</style>