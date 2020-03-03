<template>
    <el-dialog
            :title="!form.id?'新增':'编辑'"
            :close-on-click-modal="false"
            :visible.sync="visible">
        <el-form ref="form" :model="form">
            <el-form-item prop="name">
                <el-input type="text" v-model="form.name" auto-complete="off" placeholder="姓名"></el-input>
            </el-form-item>
            <el-form-item prop="no">
                <el-input type="text" v-model="form.no" auto-complete="off" placeholder=账号></el-input>
            </el-form-item>
            <el-form-item prop="idCard">
                <el-input type="text" v-model="form.idCard" auto-complete="off" placeholder="卡号"></el-input>
            </el-form-item>
            <el-form-item prop="mobile">
                <el-input type="text" v-model="form.mobile" auto-complete="off" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="text" v-model="form.password" auto-complete="off" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" style="width:100%;" @click="handleSubmit('loginForm')">登录
                </el-button>
            </el-form-item>

        </el-form>

    </el-dialog>
</template>

<script>
    import {employeeEdit} from '@/api/employeeEdit';

    export default {
        name: "EditDialog",
        data() {
            return {
                visible: false,
                form: {
                    idCard: ''
                }
            }
        },
        methods: {
            init(id) {
                this.form = {}
                this.form.id = id || 0;
                this.visible = true;
                this.$nextTick(() => {
                    if (this.form.id > 0) {
                        this.getEmployeeDetail()
                    }
                })
            },

            async getEmployeeDetail() { //获取数据
                let res = await employeeEdit(this.form.id);
                console.log(res);
                if (res.code === 1000) {
                    this.form = res.data
                } else {
                    this.$message.error(res.msg);
                }
            },
        }

    }
</script>

<style scoped>

</style>