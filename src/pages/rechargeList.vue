<template>
    <div>

        <div v-if="isSearchVisible" class="search" style="border-bottom: 1px solid #eaeaea;padding-bottom: 15px">
            <div class="search-group" style="padding: 5px 0;display: flex;flex: 1">
                <el-input class="search_input" v-model="search.empName" placeholder="请输入姓名" clearable>
                    <template slot="prepend">姓名</template>
                </el-input>

                <el-input class="search_input" v-model="search.empNo" placeholder="请输入账号" clearable>
                    <template slot="prepend">账号</template>
                </el-input>

                <el-input class="search_input" v-model="search.cardNo" placeholder="请输入卡号" clearable>
                    <template slot="prepend">卡号</template>
                </el-input>

                <el-input class="search_input" v-model="search.operatorName" placeholder="请输入操作人姓名" clearable>
                    <template slot="prepend">操作人</template>
                </el-input>

            </div>
            <div class="search-group" style="padding: 5px 0;display: flex;flex: 1">

                <el-select class="search_input" v-model="search.rechargeType" placeholder="请选择充值类型" clearable>
                    <el-option
                            v-for="item in rechargeTypeList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>

                <el-date-picker class="search_input"
                                v-model="search.start"
                                type="date"
                                placeholder="记账开始时间" clearable>
                </el-date-picker>

                <el-date-picker class="search_input"
                                v-model="search.end"
                                type="date"
                                placeholder="记账结束时间" clearable>
                </el-date-picker>

            </div>

            <el-button v-acl="['recharge:listlog']" type="primary" @click="serach" icon="el-icon-search">搜索</el-button>
        </div>

        <div class="option-menu clearfix">
            <el-button type="primary" class="search-btn" @click="isSearchVisible = !isSearchVisible"
                       icon="el-icon-search"
                       style="float: right;"/>
        </div>
        <div>
            <el-table
                    :data="tableData"
                    stripe
                    border
                    style="width: 100%">
                <el-table-column
                        type="index"
                        label="序号"
                        align="center">
                </el-table-column>
                <el-table-column
                        prop="employeeName"
                        label="姓名"
                        align="center"
                        width="">
                </el-table-column>
                <el-table-column
                        prop="employeeNo"
                        label="账号"
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
                        prop="createTime"
                        label="记账时间"
                        align="center"
                        width="">
                </el-table-column>
                <el-table-column
                        prop="money"
                        label="充值金额（元）"
                        align="center"
                        width="">
                </el-table-column>
                <el-table-column
                        prop="balance"
                        label="卡余额（元）"
                        align="center"
                        width="">
                </el-table-column>
                <el-table-column
                        prop="type"
                        label="充值类型"
                        align="center"
                        width="">
                </el-table-column>

                <el-table-column
                        prop="creatorName"
                        label="操作人"
                        align="center"
                        width="">
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

    </div>
</template>

<script>
    import {list} from '@/api/recharge'

    export default {
        name: "rechargeList",
        inject: ['reload'],
        data() {
            return {
                isSearchVisible: false,
                currentPage: 1,
                total: 1,
                tableData: [],
                search: {
                    cardNo: "",
                    empName: "",
                    empNo: "",
                    start: "",
                    end: "",
                    money: 0,
                    rechargeType: "",
                    operatorName: "",
                    page: 0,
                    size: 10,
                },
                rechargeTypeList: [{
                    name: '正常',
                    id: 1
                }, {
                    name: '退费',
                    id: 2
                }],
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