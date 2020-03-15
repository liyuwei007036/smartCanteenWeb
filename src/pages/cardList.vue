<template>
    <div>
        <hr style="height: 2px;background-color: #5286FF;border:none;margin-bottom: 12px;">


        <div v-if="isSearchVisible" class="search">

            <el-row :gutter="20" class="search-row">
                <el-col :span="8">
                    <div class="grid-content search-grid-content">
                        <label class="search-label">姓名：</label>
                        <el-input class="search_input" v-model="search.empName" placeholder="请输入姓名"></el-input>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content search-grid-content">
                        <label class="search-label">手机号：</label>
                        <el-input class="search_input" v-model="search.mobile" placeholder="请输入手机号"></el-input>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content search-grid-content">
                        <label class="search-label">工号：</label>
                        <el-input class="search_input" v-model="search.empNo" placeholder="请输入工号"></el-input>
                    </div>
                </el-col>
            </el-row>

            <el-row :gutter="20" class="search-row">
                <el-col :span="8">
                    <div class="grid-content search-grid-content">
                        <label class="search-label">卡号：</label>
                        <el-input class="search_input" v-model="search.cardNo" placeholder="请输入卡号"></el-input>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content search-grid-content">
                        <label class="search-label">手机号：</label>
                        <el-input class="search_input" v-model="search.mobile" placeholder="请输入手机号"></el-input>
                    </div>
                </el-col>

                <el-col :span="8">
                    <div class="grid-content search-grid-content">
                        <label class="search-label">卡状态：</label>
                        <el-select class="search_input el-input" v-model="search.cardStatus" placeholder="请选择卡状态"
                                   clearable>
                            <el-option
                                    v-for="item in carStatusList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                </el-col>
            </el-row>

            <el-row :gutter="20" class="search-row">
                <el-col :span="8">
                    <div class="grid-content search-grid-content">
                        <label class="search-label">账户状态：</label>
                        <el-select class="search_input el-input" v-model="search.accountStatus" placeholder="请选择账户状态"
                                   clearable>
                            <el-option
                                    v-for="item in accountStatusList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                </el-col>

                <el-col :span="8">
                    <div class="grid-content search-grid-content">
                        <label class="search-label">卡有效期：</label>
                        <el-date-picker class="search_input" style="margin: 0"
                                        v-model="search.start"
                                        type="date"
                                        placeholder="开始时间" clearable>
                        </el-date-picker>
                        <span style="padding: 0 5px">-</span>
                        <el-date-picker class="search_input"
                                        v-model="search.end"
                                        type="date"
                                        placeholder="结束时间" clearable>
                        </el-date-picker>
                    </div>
                </el-col>
            </el-row>

            <el-button type="primary" class="search-btn-primary" @click="serach" icon="el-icon-search"
                       v-acl="['icCard:list']">搜索
            </el-button>
        </div>

        <div class="option-menu clearfix">
            <el-button type="primary" class="add-btn" @click="patchRecharge()" icon="el-icon-plus"
                       v-acl="['recharge:recharge']">批量充值
            </el-button>
            <el-button type="primary" class="search-btn" @click="isSearchVisible = !isSearchVisible"
                       icon="el-icon-search"
                       style="float: right;"></el-button>
        </div>

        <div>
            <el-table
                    :data="tableData"
                    stripe
                    border
                    style="width: 100%; overflow-y: auto"
                    :max-height="maxHeight"
                    @selection-change="handleSelectionChange"
                    :header-cell-style="{
                    'background-color': '#F2F6FC',
                    'color':'#333333',
                    'padding':'8px 0'}">
                <el-table-column v-acl="['recharge:recharge']"
                                 type="selection"
                                 width="50"
                                 align="center"
                                 :selectable="handleDisable">
                </el-table-column>
                <el-table-column
                        type="index"
                        label="序号"
                        align="center"
                        width="80">
                </el-table-column>
                <el-table-column
                        prop="empName"
                        label="姓名"
                        align="center"
                        :show-overflow-tooltip='true'>
                </el-table-column>
                <el-table-column
                        prop="empNo"
                        label="工号"
                        align="center"
                        :show-overflow-tooltip='true'>
                </el-table-column>
                <el-table-column
                        prop="cardNo"
                        label="卡号"
                        align="center"
                        :show-overflow-tooltip='true'>
                </el-table-column>

                <el-table-column
                        prop="deposit"
                        label="押金"
                        align="center"
                        width="80"
                        :show-overflow-tooltip='true'>
                </el-table-column>

                <el-table-column
                        prop="currentBalance"
                        label="卡余额"
                        align="center"
                        width="80"
                        :show-overflow-tooltip='true'>
                </el-table-column>
                <el-table-column
                        prop="status"
                        label="卡状态"
                        align="center"
                        width="120"
                        :show-overflow-tooltip='true'>
                </el-table-column>
                <el-table-column
                        prop="accountStatus"
                        label="账户状态"
                        align="center"
                        width="120"
                        :show-overflow-tooltip='true'>
                </el-table-column>
                <el-table-column
                        prop="validityTime"
                        label="卡有效期"
                        align="center"
                        :show-overflow-tooltip='true'>
                </el-table-column>

                <el-table-column
                        prop="operation"
                        label="操作"
                        align="center"
                        width="180">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" v-acl="['recharge:recharge']"
                                   @click="recharge(scope.row.id,scope.row.empId ,scope.row.currentBalance)"
                                   v-if="scope.row.status !== '禁止'">充值
                        </el-button>

                        <el-button type="text" size="small" v-acl="['icCard:deduction']"
                                   @click="deduction(scope.row.id,scope.row.empId,scope.row.currentBalance)"
                                   v-if="scope.row.status !== '禁止'">补扣
                        </el-button>

                        <el-button type="text" size="small" v-if="scope.row.status==='激活'" class="warning-btn"
                                   v-acl="['icCard:loss']"
                                   @click="lossAccounnt(scope.row.id)">挂失
                        </el-button>
                        <el-button type="text" size="small" v-if="scope.row.accountStatus==='挂失'" class="green-btn"
                                   v-acl="['icCard:patch']"
                                   @click="replaceAccounnt(scope.row.empId)">补卡
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="page" align="right">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10,20,50,75,100]"
                    :page-size="1"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>

        <!--        充值弹窗-->
        <el-dialog class="dialog"
                   title="充值"
                   :close-on-click-modal="false"
                   :visible.sync="visible"
                   width="40%">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="left">
                <el-form-item prop="name" label="姓名" v-if="isShow">
                    <el-input type="text" v-model.trim="name" auto-complete="off" placeholder="用户姓名"
                              :readonly='true'></el-input>
                </el-form-item>

                <el-form-item prop="no" label="账号" v-if="isShow">
                    <el-input type="text" v-model.trim="no" auto-complete="off" placeholder="账号"
                              :readonly='true'></el-input>
                </el-form-item>

                <el-form-item prop="currentBalance" label="余额" v-if="isShow">
                    <el-input type="text" v-model.trim="currentBalance" auto-complete="off" placeholder="余额"
                              :readonly='true'></el-input>
                </el-form-item>

                <el-form-item label="充值类型" prop="rechargeType">
                    <el-select class="select_normal" v-model="form.rechargeType" placeholder="请选择充值类型">
                        <el-option
                                v-for="item in rechargeTypeList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="充值金额" prop="money">

                    <el-select class="select_normal"
                               v-model="form.money"
                               filterable
                               allow-create
                               default-first-option
                               clearable
                               type="number"
                               placeholder="请选择或输入充值金额">
                        <el-option
                                v-for="item in rechargeAmounntList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>

                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button class="dialog-btn-reset" @click="resetForm('form')">重 置</el-button>
            <el-button type="primary" class="dialog-btn-normal" @click="handleSubmit('form')">保存</el-button>
        </span>

        </el-dialog>

        <!--        补扣弹窗-->
        <el-dialog class="dialog"
                   title="补扣"
                   :close-on-click-modal="false"
                   :visible.sync="isDeductionVisible"
                   width="40%">
            <el-form ref="deductionForm" :model="deductionForm" :rules="deductionRules" label-width="80px"
                     label-position="left">
                <el-form-item prop="name" label="姓名">
                    <el-input type="text" v-model.trim="name" auto-complete="off" placeholder="用户姓名"
                              :readonly='true'></el-input>
                </el-form-item>

                <el-form-item prop="no" label="账号">
                    <el-input type="text" v-model.trim="no" auto-complete="off" placeholder="账号"
                              :readonly='true'></el-input>
                </el-form-item>

                <el-form-item prop="currentBalance" label="余额">
                    <el-input type="text" v-model.trim="currentBalance" auto-complete="off" placeholder="余额"
                              :readonly='true'></el-input>
                </el-form-item>

                <el-form-item label="补扣金额" prop="money">

                    <el-input type="number" v-model.trim="deductionForm.money" auto-complete="off"
                              @mousewheel.native.prevent
                              placeholder="请输入补扣金额"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button class="dialog-btn-reset" @click="resetForm('deductionForm')">重 置</el-button>
            <el-button type="primary" class="dialog-btn-normal"
                       @click="handleDeductionSubmit('deductionForm')">保存</el-button>
        </span>

        </el-dialog>

        <!--        补卡弹窗-->

        <el-dialog class="dialog abow_dialog"
                   title="补卡"
                   :close-on-click-modal="false"
                   :visible.sync="isReplaceVisible"
                   width="40%"
                   @closed="handleClose">
            <el-form ref="replaceForm" :model="replaceForm" :rules="replaceRules" status-icon label-width="100px"
                     label-position="right">
                <el-form-item prop="name" label="姓名">
                    <el-input type="text" v-model.trim="replaceForm.name" auto-complete="off"
                              placeholder="姓名" :readonly="true"></el-input>
                </el-form-item>
                <el-form-item prop="no" label="账号">
                    <el-input type="text" v-model.trim="replaceForm.no" auto-complete="off" placeholder=账号
                              :readonly="true"></el-input>
                </el-form-item>
                <el-form-item prop="idCard" label="身份证号">
                    <el-input type="text" v-model.trim="replaceForm.idCard" auto-complete="off" placeholder="身份证号"
                              :readonly="true"></el-input>
                </el-form-item>


                <el-form-item prop="mobile" label="手机号">
                    <el-input type="mobile" v-model.trim="replaceForm.mobile" auto-complete="off"
                              placeholder="手机号" :readonly="true"></el-input>
                </el-form-item>

                <el-form-item prop="cardNo" label="卡号">
                    <el-input type="number" v-model.trim="replaceForm.cardNo" auto-complete="off" placeholder="卡号"
                              :readonly="true">
                        <el-button slot="append" @click="readCard()">点击读卡</el-button>
                    </el-input>
                </el-form-item>

                <el-form-item label="卡类别">
                    <el-select class="select_normal" v-model="replaceForm.type" placeholder="请选择卡类别" :disabled="true">
                        <el-option
                                v-for="item in cardTypeList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item prop="minimumBalance" label="卡最低余额">
                    <el-input type="number" v-model.trim="replaceForm.minimumBalance" auto-complete="off"
                              :readonly="true"
                              placeholder="请输入卡最低余额"></el-input>
                </el-form-item>

                <el-form-item prop="validityTime" label="卡有效期">
                    <el-date-picker
                            v-model="replaceForm.validityTime"
                            type="date"
                            placeholder="请选择卡有效期"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :readonly="true">
                    </el-date-picker>
                </el-form-item>

                <el-form-item prop="openCardAmount" label="开卡存入金额">
                    <el-input type="number" v-model.trim="replaceForm.openCardAmount" auto-complete="off"
                              :readonly="true"
                              placeholder="请输入开卡存入金额"></el-input>
                </el-form-item>

                <el-form-item prop="deposit" label="押金">
                    <el-input type="number" v-model.trim="replaceForm.deposit" auto-complete="off" :readonly="true"
                              placeholder="请输入押金"></el-input>
                </el-form-item>


                <el-form-item prop="expense" label="工本费">
                    <el-input type="number" v-model.trim="replaceForm.expense" auto-complete="off" :readonly="true"
                              placeholder="请输入工本费"></el-input>
                </el-form-item>

                <el-button class="dialog-btn-reset" @click="resetForm('replaceForm')">重 置</el-button>
                <el-button type="primary" class="dialog-btn-normal" @click="handleSubmit1('replaceForm')">保存</el-button>
            </el-form>

        </el-dialog>
    </div>
</template>

<script>
    import {list, loss, beforeGetCard, getCard, patch, deduction} from '@/api/card';
    import {recharge} from '@/api/recharge';
    import {get} from '@/api/employeeList';
    import {SOCKET_URL} from '@/config/global'


    export default {
        name: "cardList",
        inject: ['reload'],
        data() {
            return {
                isSearchVisible: false,
                visible: false,
                isReplaceVisible: false,
                isDeductionVisible: false,
                isShow: true,
                currentPage: 1,
                total: 1,
                tableData: [],
                name: '',
                no: '',
                currentBalance: '',
                maxHeight: 1000,
                search: {
                    accountStatus: "",
                    cardNo: "",
                    cardStatus: "",
                    empName: "",
                    empNo: "",
                    start: "",
                    end: "",
                    mobile: "",
                    page: 1,
                    size: 10,
                },
                carStatusList: [{
                    name: '激活',
                    id: '1'
                }, {
                    name: '禁止',
                    id: '2'
                }],
                accountStatusList: [{
                    name: '正常',
                    id: '1'
                }, {
                    name: '挂失',
                    id: '2'
                }, {
                    name: '解挂',
                    id: '3'
                }, {
                    name: '已退卡',
                    id: '4'
                }, {
                    name: '已补卡',
                    id: '5'
                }],
                form: { //充值弹窗
                    cardIds: [],
                    money: '',
                    rechargeType: ''
                },
                replaceForm: {
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
                    cardNo: '',
                    type: '',
                    minimumBalance: '',
                    validityTime: '',
                    openCardAmount: '',
                    deposit: '',
                    expense: '',
                },
                deductionForm: {
                    cardId: '',
                    money: ''
                },
                cardTypeList: [
                    {id: 1, name: 1},
                    {id: 2, name: 2}
                ],
                multipleSelection: [],
                rechargeTypeList: [{
                    name: '正常',
                    id: 1
                }, {
                    name: '退费',
                    id: 2
                }],
                rechargeAmounntList: [{
                    name: '20',
                    id: 20
                }, {
                    name: '50',
                    id: 50
                }, {
                    name: '100',
                    id: 100
                }, {
                    name: '200',
                    id: 200
                }, {
                    name: '500',
                    id: 500
                }],
                rules: {
                    rechargeType: [{required: true, message: '请选择充值类型', trigger: 'blur'}],
                    money: [{required: true, message: '请选择或输入充值金额', trigger: 'blur'}],
                },
                replaceRules: {
                    cardNo: [{required: true, message: '必须填写卡号', trigger: 'blur'}],
                },
                deductionRules: {
                    money: [{required: true, message: '请输入补扣金额', trigger: 'blur'}],
                },
            }
        },
        mounted: function () {
            this.getList();
            this.maxHeight = this.$ViewportSize - 260
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
                console.log("'onOpen")
                let token = sessionStorage.getItem('x-smart-token') || 'x';

                this.send({token: token, start: true});
            },
            onError() {//连接建立失败重连
                this.initWebSocket();
            },
            onMessage(e) { //数据接收
                console.log("'接受数据", e)
                this.replaceForm.cardNo = e.data
                this.$forceUpdate();
            },
            send(Data) {//
                console.log('数据发送', Data)
                this.websock.send(JSON.stringify(Data));
            },
            onClose(e) {  //关闭
                console.log('断开连接', e);
            },
            serach() {
                this.search.page = 1
                this.getList();
            },

            //获取列表数据
            async getList() {
                let res = await list(this.search);
                console.log(res)
                if (res.code === 1000) {
                    this.total = res.data.total;
                    this.currentPage = res.data.currentPage;
                    this.tableData = res.data.data
                } else {
                    this.$message.error(res.msg);
                }
            },

            //充值
            recharge(id, empId, currentBalance) {
                this.visible = true;
                this.isShow = true;
                this.form.cardIds.push(id);
                this.getUserInfo(empId)
                this.currentBalance = currentBalance
            },

            //批量充值
            patchRecharge() {
                if (this.multipleSelection.length > 0) {
                    this.visible = true;
                    this.isShow = false;
                    this.multipleSelection.forEach(el => {
                        this.form.cardIds.push(el.id);
                    })
                } else {
                    this.$message.error('必须选择至少一张卡片');
                }
            },

            // 提交表单
            handleSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.addForm();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            },

            //保存数据
            async addForm() {
                let res = await recharge(this.form)
                if (res.code === 1000) {
                    this.$message.success('保存成功');
                    this.visible = false;
                    this.reload()
                }
            },

            //补扣
            deduction(id, empId, currentBalance) {
                this.isDeductionVisible = true;
                this.deductionForm.cardId = id;
                this.getUserInfo(empId)
                this.currentBalance = currentBalance
            },

            // 提交表单
            handleDeductionSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.addDeductionForm();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            //保存数据
            async addDeductionForm() {
                let res = await deduction(this.deductionForm)
                if (res.code === 1000) {
                    this.$message.success('保存成功');
                    this.visible = false;
                    this.reload()
                }
            },


            handleSelectionChange(val) {
                this.multipleSelection = val;
                console.log(this.multipleSelection)
            },

            //点击挂失按钮
            lossAccounnt(id) {
                this.$confirm('确定挂失该卡片？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.loss(id)
                }).catch(() => {
                    console.log('取消删除')
                });
            },

            //挂失
            async loss(id) {
                let res = await loss(id)
                console.log(res)
                if (res.code === 1000) {
                    this.$message.success('挂失成功');
                    this.getList()
                }
            },

            //补卡
            replaceAccounnt(id) {
                this.isReplaceVisible = true
                this.replaceForm = {};
                this.$nextTick(() => {
                    this.getUser(id)
                })
            },

            //获取用户数据
            async getUser(id) {
                let res = await get(id);
                console.log(res)
                if (res.code === 1000) {
                    this.replaceForm = res.data
                } else {
                    this.$message.error(res.msg);
                }
            },

            //读卡
            readCard() {
                this.initWebSocket();
                this.$message.success('正在读卡中');
            },

            handleSubmit1(formName) {
                console.log(this.$refs[formName])
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.patchForm();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            },

            async patchForm() {
                let res = await patch(this.replaceForm)
                console.log(res)
                if (res.code === 1000) {
                    this.$message.success('补卡成功');
                    this.visible = false;
                    this.reload()
                }
            },


            //获取用户数据
            async getUserInfo(empId) {
                let res = await get(empId);
                console.log(res)
                if (res.code === 1000) {
                    this.name = res.data.name
                    this.no = res.data.no
                } else {
                    this.$message.error(res.msg);
                }
            },

            //分页
            handleSizeChange(val) {
                this.search.size = val
                this.getList();
            },

            handleCurrentChange(val) {
                this.search.page = val
                this.getList();
            },

            handleClose() {
                let token = sessionStorage.getItem('x-smart-token') || 'x';
                this.send({token: token, start: false})
                this.onClose()
                this.$refs.replaceForm.resetFields()
            },

            // 处理表格数据,卡片为禁止的不允许充值
            // 有两个参数返回,表格的每一行对象和当前索引
            handleDisable(row, index) {
                // 函数需要一个返回值,true为可选,false为不可选择
                if (row.status === '禁止') {
                    return false
                } else {
                    return true
                }
            },

        }
    }
</script>

<style scoped>
    .select_normal /deep/ input[readonly] {
        background-color: #fff;
    }

    .select_normal /deep/ input[disabled] {
        background-color: #f1f1f5;
    }
</style>