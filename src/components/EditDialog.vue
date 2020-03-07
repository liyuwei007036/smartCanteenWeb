<template>
    <el-dialog
            :title="!form.id?'新增':'编辑'"
            :close-on-click-modal="false"
            :visible.sync="visible" width="40%">
        <el-form ref="form" :model="form" :rules="rules" status-icon label-width="80px" label-position="left">
            <el-form-item prop="name" label="姓名">
                <el-input type="text" v-model.trim="form.name" auto-complete="off" placeholder="姓名"></el-input>
            </el-form-item>
            <el-form-item prop="no" label="账号">
                <el-input type="text" v-model.trim="form.no" auto-complete="off" placeholder=账号
                          :readonly="isReadonly"></el-input>
            </el-form-item>
            <el-form-item prop="idCard" label="身份证号">
                <el-input type="text" v-model.trim="form.idCard" auto-complete="off" placeholder="身份证号"></el-input>
            </el-form-item>
            <el-form-item prop="mobile" label="手机号">
                <el-input type="text" v-model.trim="form.mobile" auto-complete="off" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item prop="password" label="卡密码">
                <el-input type="password" v-model.trim="password" auto-complete="off" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item prop="confirmPassword" label="确认密码">
                <el-input type="password" v-model.trim="confirmPassword" auto-complete="off"
                          placeholder="请再次输入密码"></el-input>
            </el-form-item>
            <el-form-item prop="originationName" label="所属组织">
                <el-input type="password" v-model="form.originationName" auto-complete="off"
                          placeholder="请选择组织"></el-input>
            </el-form-item>
            <el-form-item label="角色" prop="roles">
                <el-select v-model="form.roles" placeholder="请选择角色">
                    <el-option
                            v-for="item in roleList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="resetForm('form')">重 置</el-button>
            <el-button type="primary" @click="handleSubmit('form')">保存</el-button>
        </span>

    </el-dialog>
</template>

<script>
    import {get} from '@/api/employeeList';
    import {update} from '@/api/employeeList';
    import {add} from '@/api/employeeList';

    export default {
        name: "EditDialog",
        inject: ['reload'],
        data() {

            return {
                visible: false,
                form: {
                    id: '',
                    name: '',
                    no: '',
                    idCard: '',
                    mobile: '',
                    password: '',
                    confirmPassword: '',
                    originationId: 1,
                    originationName: "",
                    roles: [],
                },
                roleList: [{
                    id: 0, name: 'ceshi'
                }],
                password: '',
                confirmPassword: '',
                isReadonly: false,
                rules: {
                    name: [{required: true, message: '请输入姓名', trigger: 'blur'}],
                    no: [{required: true, message: '请输入账号', trigger: 'blur'}],
                    idCard: [
                        {required: true, message: '请输入身份证号', trigger: 'blur'},
                        {min: 18, max: 18, message: '身份证号为18位', trigger: 'blur'}],
                    mobile: [{required: true, message: '请输入手机号', trigger: 'blur'}],
                },
            }

        },
        watch: {
            password: {
                handler(n, o) {
                    this.form.password = n
                }
            },
            confirmPassword: {
                handler(n, o) {
                    this.form.confirmPassword = n
                }
            }
        },
        methods: {
            init(id) {
                this.form = {};
                this.form.id = id || 0;
                this.visible = true;
                this.$nextTick(() => {
                    //编辑
                    if (this.form.id > 0) {
                        this.getEmployeeDetail()
                        this.isReadonly = true
                    }
                })
            },

            async getEmployeeDetail() { //获取员工数据
                let res = await get(this.form.id);
                if (res.code === 1000) {
                    this.form = res.data
                    this.form.originationId = 1
                } else {
                    this.$message.error(res.msg);
                }
            },


            // 提交表单
            handleSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.form.id > 0) {
                            this.updateForm()
                        } else {
                            this.addForm()
                        }
                    } else {
                        console.log(this.form.password)
                        console.log(this.form.confirmPassword)
                        console.log('error submit!!');
                        return false;
                    }
                });

            },

            //更新数据
            async updateForm() {
                let res = await update(this.form)
                if (res.code === 1000) {
                    this.$message.success('保存成功');
                    this.visible = false;
                    this.reload()
                }
            },

            //保存数据
            async addForm() {
                let res = await add(this.form)
                if (res.code === 1000) {
                    this.$message.success('保存成功');
                    this.visible = false;
                    this.reload()
                }
            },

            resetForm(formName) {
                this.$refs[formName].resetFields();
            }

        }

    }
</script>

<style scoped>

</style>