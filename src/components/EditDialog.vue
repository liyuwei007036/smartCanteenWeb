<template>
    <el-dialog
            :title="!form.id?'新增':'编辑'"
            :close-on-click-modal="false"
            :visible.sync="visible">
        <el-form ref="form" :model="form" :rules="rules">
            <el-form-item prop="name" label="姓名">
                <el-input type="text" v-model="form.name" auto-complete="off" placeholder="姓名"></el-input>
            </el-form-item>
            <el-form-item prop="no" label="账号">
                <el-input type="text" v-model="form.no" auto-complete="off" placeholder=账号></el-input>
            </el-form-item>
            <el-form-item prop="idCard" label="身份证号">
                <el-input type="text" v-model="form.idCard" auto-complete="off" placeholder="身份证号"></el-input>
            </el-form-item>
            <el-form-item prop="mobile" label="手机号">
                <el-input type="text" v-model="form.mobile" auto-complete="off" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item prop="password" label="卡密码">
                <el-input type="text" v-model="form2.password1" auto-complete="off"  placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item prop="checkpassword" label="确认密码">
                <el-input type="text" v-model="form2.password2" auto-complete="off" placeholder="请再次输入密码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" style="width:100%;" @click="handleSubmit('form')">保存
                </el-button>
            </el-form-item>

        </el-form>

    </el-dialog>
</template>

<script>
    import {employeeEdit} from '@/api/employeeList';
    import {employeeUpdate} from '@/api/employeeList';
    import {employeeAdd} from '@/api/employeeList';

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
                },
                form2:{
                    password1:'',
                    password2:'',
                },
                rules: {
                    name: [{required: true, message: '请输入姓名', trigger: 'blur'}],
                    no: [{required: true, message: '请输入账号', trigger: 'blur'}],
                    idCard: [
                        {required: true, message: '请输入身份证号', trigger: 'blur'},
                        {min: 18, max: 18, message: '身份证号为18位', trigger: 'blur'}],
                    mobile: [{required: true, message: '请输入手机号', trigger: 'blur'}],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 6, max: 20, message: '密码长度在 6 到 20 位之间', trigger: 'blur'}
                    ],
                },
            }
        },

        methods: {
            init(id) {
                this.form = {};
                this.form.id = id || 0;
                this.visible = true;
                this.$nextTick(() => {
                    if (this.form.id > 0) {
                        this.getEmployeeDetail()
                    }
                })
            },

            async getEmployeeDetail() { //获取员工数据
                let res = await employeeEdit(this.form.id);
                if (res.code === 1000) {
                    this.form = res.data
                } else {
                    this.$message.error(res.msg);
                }
            },

            //更新数据
            async updateForm() {
                let res = await employeeUpdate(this.form)
                if (res.code === 1000) {
                    this.$message.success('保存成功');
                    this.visible = false;
                    this.reload()
                }
            },

            //保存数据
            async addForm() {
                let res = await employeeAdd(this.form)
                if (res.code === 1000) {
                    this.$message.success('保存成功');
                    this.visible = false;
                    this.reload()
                }
            },

            handleSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log(this.form.id)
                        if (this.form.id > 0) {
                            this.updateForm()
                        } else {
                            this.addForm()
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            }
        }

    }
</script>

<style scoped>

</style>