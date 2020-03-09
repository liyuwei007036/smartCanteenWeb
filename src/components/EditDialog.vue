<template>
    <el-dialog
            :title="!form.id?'新增':'编辑'"
            :close-on-click-modal="false"
            :visible.sync="visible" width="40%"
            @closed="handleClose">
        <el-form ref="form" :model="form" :rules="rules" status-icon label-width="100px" label-position="right">
            <el-form-item prop="name" label="姓名">
                <el-input type="text" v-model.trim="form.name" auto-complete="off" placeholder="姓名"></el-input>
            </el-form-item>
            <el-form-item prop="no" label="账号">
                <el-input type="text" v-model.trim="form.no" auto-complete="off" placeholder=账号
                          :readonly="isReadonly"></el-input>
            </el-form-item>
            <el-form-item prop="idCard" label="身份证号">
                <el-input type="text" v-model.trim="form.idCard" auto-complete="off" placeholder="身份证号"
                          :readonly="isReadonly"></el-input>
            </el-form-item>


            <el-form-item prop="mobile" label="手机号">
                <el-input type="mobile" v-model.trim="form.mobile" auto-complete="off" placeholder="手机号"></el-input>
            </el-form-item>

            <el-form-item prop="cardNo" label="卡号">
                <el-input type="number" v-model.trim="form.cardNo" auto-complete="off" placeholder="卡号"
                          :readonly="isReadonly">
                    <el-button slot="append" v-if="!isReadonly" @click="readCard()">点击读卡</el-button>
                </el-input>
            </el-form-item>

            <el-form-item label="卡类别">
                <el-select class="select_normal" v-model="form.type" placeholder="请选择卡类别">
                    <el-option
                            v-for="item in cardTypeList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item prop="password" label="卡密码">
                <el-input type="password" v-model.trim="password" auto-complete="off" placeholder="密码"></el-input>
            </el-form-item>

            <el-form-item prop="confirmPassword" label="确认密码">
                <el-input type="password" v-model.trim="confirmPassword" auto-complete="off"
                          placeholder="请再次输入密码"></el-input>
            </el-form-item>

            <el-form-item prop="minimumBalance" label="卡最低余额">
                <el-input type="number" v-model.trim="form.minimumBalance" auto-complete="off"
                          placeholder="请输入卡最低余额"></el-input>
            </el-form-item>

            <el-form-item prop="validityTime" label="卡有效期">
                <el-date-picker
                        v-model="form.validityTime"
                        type="date"
                        placeholder="请选择卡有效期"
                        value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
            </el-form-item>

            <el-form-item prop="openCardAmount" label="开卡存入金额">
                <el-input type="number" v-model.trim="form.openCardAmount" auto-complete="off"
                          placeholder="请输入开卡存入金额"></el-input>
            </el-form-item>

            <el-form-item prop="deposit" label="押金">
                <el-input type="number" v-model.trim="form.deposit" auto-complete="off"
                          placeholder="请输入押金"></el-input>
            </el-form-item>


            <el-form-item prop="expense" label="工本费">
                <el-input type="number" v-model.trim="form.expense" auto-complete="off"
                          placeholder="请输入工本费"></el-input>
            </el-form-item>

            <el-form-item label="角色" prop="roles">
                <el-select class="select_normal" v-model="form.roles" multiple placeholder="请选择角色">
                    <el-option
                            v-for="item in roleList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item prop="originationName" label="所属组织">
                <el-input
                        placeholder="请选择所属组织"
                        class="width-220 selectTree-input"
                        auto-complete="off"
                        v-model="form.originationName"
                        @click.native="changeSelectTree()">
                </el-input>

                <el-tree v-show="isShowSelect"
                         empty-text="暂无数据"
                         :highlight-current=true
                         :default-expand-all=false
                         :expand-on-click-node="true"
                         :data="data"
                         :filter-node-method="filterNode"
                         @node-click="selectClassfy"
                         class="width-220 selectTree-input objectTree"
                         ref="selectTree">
                </el-tree>

            </el-form-item>


        </el-form>
        <span slot="footer" class="dialog-footer">
<!--            <el-button @click="resetForm('form')">重 置</el-button>-->
            <el-button type="primary" @click="handleSubmit('form')">保存</el-button>
        </span>

    </el-dialog>
</template>

<script>
    import {get} from '@/api/employeeList';
    import {update} from '@/api/employeeList';
    import {add} from '@/api/employeeList';
    import {listAll} from '@/api/origination';
    import {listAllRole} from '@/api/role';
    import {beforeGetCard} from '@/api/card';
    import {getCard} from '@/api/card';

    export default {
        name: "EditDialog",
        inject: ['reload'],
        data() {

            let validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'))
                } else if (value !== this.form.password) {
                    callback(new Error('两次输入密码不一致!'))
                } else {
                    callback()
                }
            }

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
                    cardId: '',
                    cardNo: '11111',
                    roles: [],
                    type: '',
                    minimumBalance: '',
                    validityTime: '',
                    openCardAmount: '',
                    deposit: '',
                    expense: ''
                },
                roleList: [],
                cardTypeList: [
                    {id: 1, name: 1},
                    {id: 2, name: 2}
                ],
                data: [{
                    label: '一级 1',
                    children: [{
                        label: '二级 1-1',
                        children: [{
                            label: '三级 1-1-1',
                            children: []
                        }]
                    }]
                }, {
                    label: '一级 2',
                    children: [{
                        label: '二级 2-1',
                        children: [{
                            label: '三级 2-1-1',
                            children: []
                        }]
                    }, {
                        label: '二级 2-2',
                        children: [{
                            label: '三级 2-2-1',
                            children: []
                        }]
                    }]
                }, {
                    label: '一级 3',
                    children: [{
                        label: '二级 3-1',
                        children: [{
                            label: '三级 3-1-1',
                            children: []
                        }]
                    }, {
                        label: '二级 3-2',
                        children: [{
                            label: '三级 3-2-1',
                            children: []
                        }]
                    }]
                }],
                password: '',
                confirmPassword: '',
                isReadonly: false, //是否只读
                isShowSelect: false, //组织结构下拉树
                timer: 0,
                t: null,
                searchCardNo: '',
                rules: {
                    name: [{required: true, message: '请输入姓名', trigger: 'blur'}],
                    no: [{required: true, message: '请输入账号', trigger: 'blur'}],
                    idCard: [
                        {required: true, message: '请输入身份证号', trigger: 'blur'},
                        {min: 18, max: 18, message: '身份证号为18位', trigger: 'blur'}],
                    mobile: [{required: true, message: '请输入手机号', trigger: 'blur'}],
                    // password: [
                    //     {pattern: /^[a-zA-Z0-9]{6,20}$/, message: '请输入手机号'}
                    // ],
                    confirmPassword: [
                        {validator: validatePass2, trigger: 'blur'}
                    ]
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
                    console.log(this.form.confirmPassword)
                    this.form.confirmPassword = n
                }
            },
            form: {
                handler(form) {
                    if (this.isShowSelect) {
                        this.$refs.selectTree.filter(form.originationName);
                    }
                },
                deep: true,//深度监听，重要
            },
            searchCardNo: {
                handler(n, o) {
                    this.form.cardNo = n
                }
            }
        },
        methods: {
            init(id) {
                this.form = {};
                this.form.id = id || 0;
                this.visible = true;
                this.getOrigination()  //获取组织结构
                this.getEmployeeRole()  //获取角色下拉列表
                this.$nextTick(() => {
                    this.form.originationId = '1'
                    //编辑，获取用户信息，设置字段只读
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
                    //初始化卡号，卡类型
                    this.form.cardId = 1
                    this.form.type = 1
                } else {
                    this.$message.error(res.msg);
                }
            },

            //获取角色列表
            async getEmployeeRole() {
                let res = await listAllRole()
                if (res.code === 1000) {
                    this.roleList = res.data
                }
            },


            // 提交表单
            handleSubmit(formName) {
                console.log(this.form.password)
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.form.id > 0) {
                            this.updateForm()  //编辑调更新接口
                        } else {
                            this.addForm()   //新增调新增接口
                        }
                    } else {
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

            //读卡
            readCard() {
                console.log('正在读卡')
                this.beforeGetCardNo()
            },

            async beforeGetCardNo() { //获取卡号
                if (this.timer > 0) {
                    console.log("已点击！！！")
                    return
                } else {
                    let res = await beforeGetCard()
                    if (res.code === 1000) {
                        this.t = setInterval(this.getCardNo, 1000);
                    }
                }
            },

            async getCardNo() { //获取卡号
                this.timer++;
                if (this.timer > 10) {
                    clearInterval(this.t)
                    this.timer = 0
                    return
                }
                let res = await getCard()
                if (res && res.code === 1000) {
                    let rno = res.data
                    if (rno && rno.length > 0) {
                        this.form.cardNo = rno
                        console.log(this.form.cardNo)
                        this.$forceUpdate();
                        clearInterval(this.t)
                    }

                }
            },


            async getOrigination() { //获取组织数据
                let res = await listAll();
                console.log(res)
                this.data = res.data
            },

            selectClassfy(data) {
                this.form.originationName = data.label;
                this.form.originationId = data.id;
                this.isShowSelect = false;
            },

            handleClose() {
                this.$refs.form.resetFields()
            },

            //
            changeSelectTree() {
                this.isShowSelect = true;
            },

            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },

            resetForm(formName) {
                this.$refs[formName].resetFields();
            }

        }

    }
</script>

<style scoped>
    .select_normal /deep/ input[readonly] {
        background-color: #fff;
    }
</style>