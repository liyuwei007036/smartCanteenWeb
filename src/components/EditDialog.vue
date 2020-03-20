<template>
    <el-dialog class="dialog"
               width="40%"
               :title="!form.id?'新增人员':'修改人员'"
               :close-on-click-modal="false"
               :visible.sync="visible"
               @closed="handleClose">
        <el-form ref="form" :model="form" :rules="rules" status-icon label-width="120px" label-position="right">
            <el-form-item prop="name" label="姓名">
                <el-input type="text" v-model.trim="form.name" auto-complete="off" placeholder="姓名"/>
            </el-form-item>
            <el-form-item prop="no" label="账号">
                <el-input type="text" v-model.trim="form.no" auto-complete="off" placeholder=账号
                          :readonly="isReadonly"/>
            </el-form-item>

            <el-form-item prop="password" label="登录密码">
                <el-input type="password" v-model.trim="form.password" auto-complete="off"
                          placeholder="登录密码"/>
            </el-form-item>

            <el-form-item prop="confirmPassword" label="确认密码">
                <el-input type="password" v-model.trim="form.confirmPassword" auto-complete="off"
                          placeholder="请再次输入密码"/>
            </el-form-item>

            <el-form-item prop="idCard" label="身份证号">
                <el-input type="text" v-model.trim="form.idCard" auto-complete="off" placeholder="身份证号"
                          :readonly="isReadonly" maxlength="18"/>
            </el-form-item>

            <el-form-item prop="mobile" label="手机号">
                <el-input type="mobile" v-model.trim="form.mobile" auto-complete="off" placeholder="手机号"
                          maxlength="11"/>
            </el-form-item>

            <el-form-item prop="cardNo" label="卡号" class="getCard">
                <el-input type="number" id="cardNo" v-model.trim="form.cardNo" auto-complete="off" placeholder="卡号"
                          :readonly="isReadonly"
                          @mousewheel.native.prevent>
                </el-input>
                <el-button v-if="!isReadonly" @click="readCard()" v-text="status_text"
                           style="margin-left: 10px;height: 34px;color: #fff;background-color: #2E6CFE;font-size: 13px;line-height: 34px;padding:0 10px;border: none">
                </el-button>
            </el-form-item>

            <el-form-item prop="validityTime" label="卡有效期">
                <el-date-picker
                        v-model="form.validityTime"
                        type="date"
                        placeholder="请选择卡有效期"
                        :picker-options="pickerOptions"
                        value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
            </el-form-item>

            <el-form-item prop="openCardAmount" label="开卡存入金额(元)">
                <el-input type="number" v-model.trim="form.openCardAmount" auto-complete="off"
                          placeholder="请输入开卡存入金额" @mousewheel.native.prevent/>
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
            <el-button class="dialog-btn-reset" @click="resetForm('form')">重 置</el-button>
            <el-button type="primary" class="dialog-btn-normal" @click="handleSubmit('form')">保存</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import {add, get, update} from '@/api/employeeList';
    import {listAll} from '@/api/origination';
    import {listAllRole} from '@/api/role';
    import {SOCKET_URL} from '@/config/global'

    export default {
        name: "EditDialog",
        inject: ['reload'],
        data: function () {
            let validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    if (this.form.password && this.form.password.length > 0) {
                        callback(new Error('请再次输入密码'))
                    } else {
                        callback()
                    }
                } else if (value !== this.form.password) {
                    callback(new Error('两次输入密码不一致!'))
                } else {
                    callback()
                }
            }

            let validateOrg = (rule, value, callback) => {
                let that = this
                setTimeout(function () {
                    if (that.form.originationName === '') {
                        callback(new Error('请选择组织结构'));
                    } else {
                        callback()
                    }
                }, 200)
            }

            let checkPhone = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('手机号不能为空'));
                } else {
                    const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
                    if (reg.test(value)) {
                        callback();
                    } else {
                        return callback(new Error('请输入正确的手机号'));
                    }
                }
            };

            return {
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now();
                    },
                },
                visible: false,
                status_text: '点击读卡',
                form: {
                    id: '',
                    name: '',
                    no: '',
                    idCard: '',
                    mobile: '',
                    password: '',
                    confirmPassword: '',
                    originationId: '',
                    originationName: "",
                    cardId: '',
                    cardNo: '',
                    roles: [],
                    type: 1,
                    minimumBalance: 0,
                    validityTime: new Date('2099-12-31'),
                    openCardAmount: 0,
                    deposit: 0,
                    expense: 0,
                },
                roleList: [],
                cardTypeList: [
                    {id: 1, name: 1},
                    {id: 2, name: 2}
                ],
                data: [],
                isReadonly: false, //是否只读
                isShowSelect: false, //组织结构下拉树
                timer: 0,
                t: null,
                searchCardNo: '',
                rules: {
                    name: [{required: true, message: '请输入姓名', trigger: 'blur'}],
                    no: [{required: true, message: '请输入账号', trigger: 'blur'}],
                    cardNo: [
                        {required: true, message: '卡号不能为空', trigger: 'blur'}],
                    mobile: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                        {validator: checkPhone, trigger: 'blur'}
                    ],
                    roles: [
                        {required: true, message: '请选择角色', trigger: 'blur'},
                    ],
                    confirmPassword: [
                        {validator: validatePass2, trigger: 'blur'}
                    ],
                    originationName: [
                        {validator: validateOrg, trigger: 'blur'},
                    ],
                    openCardAmount: [{
                        required: true,
                        pattern: /^\d+$|^([0-9]+\.\d{1,2})$/,
                        message: '开卡存入金额必须大于0',
                        trigger: 'blur'
                    }],
                },

            }
        },

        watch: {},
        created() {
        },
        destroyed() {

        },
        methods: {
            initWebSocket() { //初始化weosocket
                const wsUri = SOCKET_URL + this.$route.name
                this.websock = new WebSocket(wsUri);
                this.websock.onmessage = this.onMessage;
                this.websock.onopen = this.onOpen;
                this.websock.onerror = this.onMessage;
                this.websock.onclose = this.onClose;
            },
            onOpen() { //连接建立之后执行send方法发送数据
                let token = sessionStorage.getItem('x-smart-token') || 'x';
                this.onSend({token: token, start: true});
            },
            onError() {//连接建立失败重连
                this.initWebSocket();
            },
            onMessage(e) { //数据接收
                this.form.cardNo = e.data
                this.$forceUpdate();
            },
            onSend(Data) {//
                this.websock.send(JSON.stringify(Data));
            },
            onClose(e) {  //关闭
                this.websock.close();
            },
            init(id) {
                this.form.id = id || 0;
                this.visible = true;
                this.getOrigination()  //获取组织结构
                this.getEmployeeRole()  //获取角色下拉列表
                this.$nextTick(() => {
                    //编辑，获取用户信息，设置字段只读
                    if (this.form.id > 0) {
                        this.getEmployeeDetail()
                        this.isReadonly = true
                    } else {
                        this.isReadonly = false
                    }
                })
            },

            async getEmployeeDetail() { //获取员工数据
                let res = await get(this.form.id);
                if (res.code === 1000) {
                    this.form = res.data
                } else {
                    this.$message.error(res.msg);
                }
            },

            //获取角色列表
            async getEmployeeRole() {
                let res = await listAllRole()
                if (res.code === 1000) {
                    this.roleList = res.data
                    if (this.form.id === 0) {
                        res.data.forEach(el => {
                            if (el.isDefault === true) {
                                this.form.roles.push(el.id);
                            }
                        })
                    }
                }
            },


            // 提交表单
            handleSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.form.id > 0) {
                            this.updateForm()  //编辑调更新接口
                        } else {
                            this.addForm()   //新增调新增接口
                        }
                    } else {

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
                this.initWebSocket();

                this.$message.success('正在读卡中');
            },

            async getOrigination() { //获取组织数据
                let res = await listAll();
                this.data = res.data
            },

            selectClassfy(data) {
                this.form.originationName = data.label;
                this.form.originationId = data.id;
                this.isShowSelect = false;
            },

            handleClose() {
                if (this.websock && this.websock.readyState === 0) {
                    this.onClose()
                }
                if (this.websock && this.websock.readyState === 1) {
                    let token = sessionStorage.getItem('x-smart-token') || 'x';
                    this.onSend({token: token, start: false})
                    this.onClose()
                }
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
                this.getEmployeeRole()  //获取角色下拉列表
                if (this.form.id > 0) {
                    this.$refs[formName].clearValidate()
                    this.init(this.form.id)
                } else {
                    this.$refs[formName].resetFields();
                }
            }
        }
    }
</script>

<style scoped>
    .select_normal /deep/ input[readonly] {
        background-color: #fff;
    }

    .getCard /deep/ .el-form-item__content {
        display: flex;
        justify-content: center;
        align-items: center;
    }


    /deep/ .el-dialog {
        display: flex;
        flex-direction: column;
        margin: 0 !important;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        /*height:600px;*/
        max-height: calc(100% - 30px);
        max-width: calc(100% - 30px);
    }

    /deep/ .el-dialog .el-dialog__body {
        flex: 1;
        overflow: auto;
    }
</style>