<template>
    <div>
        <div v-if="isSearchVisible" class="search" style="border-bottom: 1px solid #eaeaea;padding-bottom: 15px">
            <div class="search-group" style="padding: 5px 0;display: flex;flex: 1">
                <el-input class="search_input" v-model="search.empName" placeholder="请输入姓名">
                    <template slot="prepend">姓名</template>
                </el-input>
                <el-input class="search_input" v-model="search.mobile" placeholder="请输入手机号">
                    <template slot="prepend">手机号</template>
                </el-input>
                <el-input class="search_input" v-model="search.empNo" placeholder="请输入账号">
                    <template slot="prepend">用户账号</template>
                </el-input>
                <el-input class="search_input" v-model="search.cardNo" placeholder="请输入卡号">
                    <template slot="prepend">卡号</template>
                </el-input>
            </div>
            <div class="search-group" style="padding: 5px 0;display: flex;flex: 1">
                <el-select class="search_input" v-model="search.cardStatus" placeholder="请选择卡状态" clearable>
                    <el-option
                            v-for="item in carStatusList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
                <el-select class="search_input" v-model="search.accountStatus" placeholder="请选择账户状态" clearable>
                    <el-option
                            v-for="item in accountStatusList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>


                <el-date-picker class="search_input"
                                v-model="search.start"
                                type="date"
                                placeholder="卡有效期开始时间" clearable>
                </el-date-picker>

                <el-date-picker class="search_input"
                                v-model="search.end"
                                type="date"
                                placeholder="卡有效期结束时间" clearable>
                </el-date-picker>

            </div>

            <el-button type="primary" @click="serach" icon="el-icon-search">搜索</el-button>
        </div>

        <div class="option-menu clearfix">
            <el-button type="primary" class="add-btn" @click="patchRecharge()" icon="el-icon-plus">批量充值
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
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
                <el-table-column
                        type="selection"
                        width="55"
                        align="center">
                </el-table-column>
                <el-table-column
                        type="index"
                        label="序号"
                        align="center">
                </el-table-column>
                <el-table-column
                        prop="empName"
                        label="姓名"
                        align="center"
                        width="">
                </el-table-column>
                <el-table-column
                        prop="empNo"
                        label="账号"
                        align="center"
                        width="">
                </el-table-column>
                <el-table-column
                        prop="mobile"
                        label="手机号"
                        align="center"
                        width="">
                </el-table-column>
                <el-table-column
                        prop="cardNo"
                        label="卡号"
                        align="center"
                        width="">
                </el-table-column>

                <el-table-column
                        prop="cardType"
                        label="卡类型"
                        align="center"
                        width="">
                </el-table-column>

                <el-table-column
                        prop="deposit"
                        label="押金"
                        align="center"
                        width="">
                </el-table-column>

                <el-table-column
                        prop="currentBalance"
                        label="卡余额（元）"
                        align="center"
                        width="">
                </el-table-column>
                <el-table-column
                        prop="status"
                        label="卡状态"
                        align="center"
                        width="">
                </el-table-column>
                <el-table-column
                        prop="accountStatus"
                        label="账户状态"
                        align="center"
                        width="">
                </el-table-column>
                <el-table-column
                        prop="validityTime"
                        label="卡有效期"
                        align="center"
                        width="">
                </el-table-column>

                <el-table-column
                        prop="operation"
                        label="操作"
                        align="center"
                        fixed="right"
                        width="">
                    <template slot-scope="scope">
                        <el-button type="text" size="small"
                                   @click="recharge(scope.row.id)">充值
                        </el-button>
                        <el-button type="text" size="small"
                                   @click="cancelAccount(scope.row.id)">销户退卡
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
        <el-dialog
                title="充值"
                :close-on-click-modal="false"
                :visible.sync="visible">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="left">
                <el-form-item prop="name" label="姓名" v-if="isShow">
                    <el-input type="text" v-model.trim="form.name" auto-complete="off" placeholder="用户姓名"
                              :readonly='true'></el-input>
                </el-form-item>

                <el-form-item prop="idCard" label="账号" v-if="isShow">
                    <el-input type="text" v-model.trim="form.idCard" auto-complete="off" placeholder="账号"
                              :readonly='true'></el-input>
                </el-form-item>

                <el-form-item prop="cardNo" label="余额" v-if="isShow">
                    <el-input type="text" v-model.trim="form.cardNo" auto-complete="off" placeholder="卡号"
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
<!--            <el-button @click="resetForm('form')">重 置</el-button>-->
            <el-button type="primary" @click="handleSubmit('form')">保存</el-button>
        </span>

        </el-dialog>

    </div>
</template>

<script>
    import {list} from '@/api/card';
    import {recharge} from '@/api/recharge';

    export default {
        name: "cardList",
        inject: ['reload'],
        data() {
            return {
                isSearchVisible: false,
                visible: false,
                isShow: true,
                currentPage: 1,
                total: 1,
                tableData: [],
                search: {
                    accountStatus: "",
                    cardNo: "",
                    cardStatus: "",
                    empName: "",
                    empNo: "",
                    end: "",
                    mobile: "",
                    page: 1,
                    size: 10,
                    start: ""
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
                form: {
                    cardIds: [],
                    money: '',
                    rechargeType: ''
                },
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
            }
        },

        mounted: function () {
            this.getList();
        },

        methods: {
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
            recharge(id) {
                this.visible = true;
                this.isShow = true;
                this.form.cardIds.push(id);
                console.log(this.form.cardIds)
            },

            //批量充值
            patchRecharge() {
                console.log()
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

            handleSelectionChange(val) {
                this.multipleSelection = val;
                console.log(this.multipleSelection)
            },

            //分页
            handleSizeChange(val) {
                this.search.size = val
                this.getList();
            },

            handleCurrentChange(val) {
                this.search.page = val
                this.getList();
            }
        }
    }
</script>

<style scoped>

</style>