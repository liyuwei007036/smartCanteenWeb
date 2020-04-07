<template>
    <div>
        <div style="float: left;display: flex;align-items: center;font-size: 16px">
<!--            <el-image :src="require('@/assets/logo-lion.png')" style="width: 50px;height:50px"/>-->
            <span>通服信息管理系统</span>
        </div>
        <div class="demonstration">
            <el-image :src="require('@/assets/b730ea28a331725fd1ae1ac746795ab.png')" class="header-img"/>
            <span class="user-name" style="padding:0 5px;">欢迎您：{{user.name}}</span>|
            <span style="color: #777;cursor:pointer;padding:0 5px;" @click="changePassword">修改密码</span>&nbsp;| &nbsp;
            <span style="color: #777;cursor:pointer;padding:0 5px;" @click="out">安全退出</span>
        </div>
        <div>
            <!--        弹窗-->
            <el-dialog
                    title="修改密码"

                    width="30%"
                    :close-on-click-modal="false"
                    :visible.sync="isChangePasswordVisible">
                <el-form ref="changePasswordform" :model="changePasswordform" :rules="rules" label-width="80px"
                         label-position="left">
                    <el-form-item prop="oldPassword" label="原密码">
                        <el-input type="password" v-model.trim="changePasswordform.oldPassword" auto-complete="off"
                                  placeholder="原密码"/>
                    </el-form-item>
                    <el-form-item prop="newPassword" label="新密码">
                        <el-input type="password" v-model.trim="changePasswordform.newPassword" auto-complete="off"
                                  placeholder="新密码"/>
                    </el-form-item>
                    <el-form-item prop="confirmPassword" label="确认密码">
                        <el-input type="password" v-model.trim="changePasswordform.confirmPassword" auto-complete="off"
                                  placeholder="确认密码"/>
                    </el-form-item>

                </el-form>
                <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleChangeSubmit()">保存</el-button>
        </span>

            </el-dialog>
        </div>
    </div>
</template>
<script>
    import router from "../router";
    import {changePassword, loginOut} from "../api/login";

    export default {
        data() {
            let validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'))
                } else if (value !== this.changePasswordform.newPassword) {
                    callback(new Error('两次输入密码不一致!'))
                } else {
                    callback()
                }
            }

            return {
                user: this.getCurrentUser(),
                changePasswordform: {
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                },
                isChangePasswordVisible: false,
                rules: {
                    oldPassword: [
                        {required: true, message: '请输入原密码', trigger: 'blur'},
                        {min: 1, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'}
                    ],
                    newPassword: [
                        {required: true, message: '请输入新密码', trigger: 'blur'},
                        {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'}
                    ],
                    confirmPassword: [
                        {required: true, message: '请输入确认密码', trigger: 'blur'},
                        {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'},
                        {validator: validatePass2, trigger: 'blur'}
                    ],
                },
            };
        },
        beforeCreate() {
        },
        methods: {
            async out() {
                let res = await loginOut()
                if (res) {
                    await router.push({
                        path: '/login'
                    })
                    sessionStorage.clear()
                }
            },
            getCurrentUser() {
                try {
                    let user = sessionStorage.getItem('user');
                    if (!user) {
                        router.push({
                            name: `login`
                        })
                    }
                    return JSON.parse(user)
                } catch (e) {
                    router.push({
                        name: `login`
                    })
                }
            },
            changePassword() {
                this.isChangePasswordVisible = true
            },
            async doChangePassword() {
                let res = await changePassword(this.changePasswordform)
                if (res.code === 1000) {
                    this.$message.success('操作成功')
                }
            },
            handleChangeSubmit() {
                this.$refs['changePasswordform'].validate((valid) => {
                    if (valid) {
                        this.doChangePassword()
                    } else {
                        return false;
                    }
                });
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
