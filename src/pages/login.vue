<template>
    <el-row type="flex" justify="center">
        <el-col :xs="12" :sm="8" :md="6" :lg="6" :xl="6" class="login-form">
            <el-form ref="loginForm" :model="loginForm" :rules="rules">
                <h3 class="title">欢迎登录</h3>
                <el-form-item prop="account">
                    <el-input type="text" v-model="loginForm.account" auto-complete="off" placeholder="账号"></el-input>
                </el-form-item>

                <el-form-item prop="password">
                    <el-input type="password" v-model="loginForm.password" auto-complete="off"
                              placeholder="密码"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" style="width:100%;" @click="handleSubmit('loginForm')">登录
                    </el-button>
                </el-form-item>

            </el-form>
        </el-col>
    </el-row>
</template>

<script>
    import {login} from '@/api/login'

    export default {
        name: "login",
        data() {
            return {
                loginForm: {
                    account: '',
                    password: '',
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
                console.log(res)
                if (res.code === 1000){
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
        margin-top: 100px;
    }
</style>