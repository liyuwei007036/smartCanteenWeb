<template>
    <div>
        <hr style="height: 2px;background-color: #5286FF;border:none;margin-bottom: 12px;">


        <div v-if="isSearchVisible" class="search" ref="search">

            <el-row :gutter="20" class="search-row">
                <el-col :span="8">
                    <div class="grid-content search-grid-content">
                        <label class="search-label">姓名：</label>
                        <el-input class="search_input" v-model="search.empName" placeholder="请输入姓名"
                                  clearable></el-input>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content search-grid-content">
                        <label class="search-label">工号：</label>
                        <el-input class="search_input" v-model="search.empNo" placeholder="请输入工号" clearable></el-input>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content search-grid-content">
                        <label class="search-label">手机号：</label>
                        <el-input class="search_input" v-model="search.mobile" placeholder="请输入手机号"
                                  clearable></el-input>
                    </div>
                </el-col>
            </el-row>

            <el-row :gutter="20" class="search-row">
                <el-col :span="8">
                    <div class="grid-content search-grid-content">
                        <label class="search-label">卡号：</label>
                        <el-input class="search_input" v-model="search.cardNo" placeholder="请输入卡号" clearable></el-input>
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
            <el-button type="primary" class="search-btn" @click="toggleSearch"
                       icon="el-icon-search"
                       style="float: right;"></el-button>
        </div>

        <div>
            <el-table
                    :data="tableData"
                    stripe
                    border
                    style="width: 100%"
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
                        prop="mobile"
                        label="手机号"
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
                        prop="status"
                        label="卡状态"
                        align="center"
                        :show-overflow-tooltip='true'>
                </el-table-column>
                <el-table-column
                        prop="accountStatus"
                        label="账户状态"
                        align="center"
                        :show-overflow-tooltip='true'>
                </el-table-column>
                <el-table-column
                        prop="currentBalance"
                        label="余额(元)"
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

                        <el-button type="text" size="small" v-acl="['icCard:deduction']" class="delete-btn"
                                   @click="deduction(scope.row.id,scope.row.empId,scope.row.currentBalance)"
                                   v-if="scope.row.status !== '禁止'">补扣
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
                   width="40%" @closed="handleClose">
            <el-form ref="form" :model="form" :rules="rules" label-width="104px" label-position="left">
                <el-form-item prop="name" label="姓名" v-if="isShow">
                    <el-input type="text" v-model.trim="name" auto-complete="off" placeholder="用户姓名"
                              :readonly='true'/>
                </el-form-item>

                <el-form-item prop="no" label="工号" v-if="isShow">
                    <el-input type="text" v-model.trim="no" auto-complete="off" placeholder="工号"
                              :readonly='true'/>
                </el-form-item>

                <el-form-item prop="cardNo" label="卡号" v-if="isShow">
                    <el-input type="text" v-model.trim="cardNo" auto-complete="off" placeholder="卡号"
                              :readonly='true'/>
                </el-form-item>

                <el-form-item prop="currentBalance" label="余额(元)" v-if="isShow">
                    <el-input type="text" v-model.trim="currentBalance" auto-complete="off" placeholder="余额"
                              :readonly='true'/>
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

                <el-form-item label="充值金额(元)" prop="money">
                    <el-select class="select_normal"
                               v-model="form.money"
                               filterable
                               allow-create
                               default-first-option
                               clearable
                               type="number"
                               placeholder="请选择或输入充值金额">
                        <el-option
                                v-for="item in rechargeAmountList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="充值描述">
                    <el-input type="textarea" v-model="form.description" rows="3"/>
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
                   width="40%"
                   @close="handleClose">
            <el-form ref="deductionForm" :model="deductionForm" :rules="deductionRules" label-width="105px"
                     label-position="left">
                <el-form-item prop="name" label="姓名">
                    <el-input type="text" v-model.trim="name" auto-complete="off" placeholder="用户姓名"
                              :readonly='true'/>
                </el-form-item>

                <el-form-item prop="no" label="工号">
                    <el-input type="text" v-model.trim="no" auto-complete="off" placeholder="工号"
                              :readonly='true'/>
                </el-form-item>

                <el-form-item prop="currentBalance" label="余额(元)">
                    <el-input type="text" v-model.trim="currentBalance" auto-complete="off" placeholder="余额"
                              :readonly='true'/>
                </el-form-item>

                <el-form-item label="补扣金额(元)" prop="money">

                    <el-input type="number" v-model.trim="deductionForm.money" auto-complete="off"
                              @mousewheel.native.prevent
                              placeholder="请输入补扣金额"/>
                </el-form-item>


                <el-form-item label="补扣描述">
                    <el-input type="textarea" v-model="deductionForm.description" rows="3"/>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button class="dialog-btn-reset" @click="resetForm('deductionForm')">重 置</el-button>
            <el-button type="primary" class="dialog-btn-normal"
                       @click="handleDeductionSubmit('deductionForm')">保存</el-button>
        </span>

        </el-dialog>
    </div>
</template>

<script>
    import {deduction, rechargeList} from '@/api/card';
    import {recharge} from '@/api/recharge';
    import {get} from '@/api/employeeList';

    export default {
        name: "rechargeDeduction",
        inject: ['reload'],
        data() {
            return {
                isSearchVisible: false,
                visible: false,
                isDeductionVisible: false,
                isShow: true,
                currentPage: 1,
                total: 1,
                tableData: [],
                name: '',
                no: '',
                cardNo: '',
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
                form: { //充值弹窗
                    cardIds: [],
                    money: '',
                    description: '',
                    rechargeType: 1
                },
                deductionForm: { //补扣弹窗
                    cardId: '',
                    cardNo: '',
                    description: '',
                    money: ''
                },
                multipleSelection: [],
                rechargeTypeList: [{
                    name: '正常',
                    id: 1
                }, {
                    name: '退费',
                    id: 2
                }],
                rechargeAmountList: [{
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
                    money: [{
                        required: true,
                        pattern: /^[1-9]\d{0,5}$|^([0-9]+\.\d{1,2})$/,
                        message: '补扣金额必须大于0小于等于999999',
                        trigger: 'blur'
                    }],
                },
                deductionRules: {
                    money: [{
                        required: true,
                        pattern: /^[1-9]\d{0,5}$|^([0-9]+\.\d{1,2})$/,
                        message: '补扣金额必须大于0小于等于999999',
                        trigger: 'blur'
                    }],
                },
            }
        },
        mounted: function () {
            this.getList();
            this.maxHeight = this.$ViewportSize - 300
        },

        methods: {
            serach() {
                this.search.page = 1
                this.getList();
            },
            //获取列表数据
            async getList() {
                let res = await rechargeList(this.search);

                if (res.code === 1000) {
                    this.total = res.data.total;
                    this.currentPage = res.data.currentPage;
                    this.tableData = res.data.data
                } else {

                }
            },

            //充值
            recharge(id, empId, currentBalance) {
                this.form = {
                    cardIds: [],
                    money: '',
                    rechargeType: 1
                }
                this.visible = true;
                this.isShow = true;
                this.form.cardIds.push(id);
                this.getUserInfo(empId)
                this.currentBalance = currentBalance
            },

            //批量充值
            patchRecharge() {
                this.form = {
                    cardIds: [],
                    money: '',
                    rechargeType: 1
                }
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

            },


            //获取用户数据
            async getUserInfo(empId) {
                let res = await get(empId);
                if (res.code === 1000) {
                    this.name = res.data.name
                    this.no = res.data.no
                    this.cardNo = res.data.cardNo
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
                try {
                    this.$refs['replaceForm'].resetFields()
                } catch (e) {

                }
                try {
                    this.$refs['form'].resetFields()
                } catch (e) {

                }
                try {
                    this.$refs['deductionForm'].resetFields()
                } catch (e) {

                }
            },

            // 处理表格数据,卡片为禁止的不允许充值
            // 有两个参数返回,表格的每一行对象和当前索引
            handleDisable(row, index) {
                // 函数需要一个返回值,true为可选,false为不可选择
                return row.status !== '禁止';
            },

            resetForm(formName) {
                this.$refs[formName].resetFields();
            },

            toggleSearch() {
                this.isSearchVisible = !this.isSearchVisible
                if (this.isSearchVisible === true) {
                    this.$nextTick(() => {
                        let height = this.$refs.search.offsetHeight;
                        this.maxHeight = this.$ViewportSize - 300 - height + 1
                    })
                } else {
                    this.maxHeight = this.$ViewportSize - 300
                }
            }

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

    .getCard /deep/ .el-form-item__content {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .clearfix:after {
        content: '\20';
        display: block;
        height: 0;
        clear: both;
    }
</style>