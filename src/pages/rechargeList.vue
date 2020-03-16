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
                        <label class="search-label">工号：</label>
                        <el-input class="search_input" v-model="search.empNo" placeholder="请输入工号"></el-input>
                    </div>
                </el-col>

                <el-col :span="8">
                    <div class="grid-content search-grid-content">
                        <label class="search-label">卡号：</label>
                        <el-input class="search_input" v-model="search.cardNo" placeholder="请输入卡号" clearable></el-input>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="search-row">
                <el-col :span="8">
                    <div class="grid-content search-grid-content">
                        <label class="search-label">操作人：</label>
                        <el-input class="search_input" v-model="search.operatorName" placeholder="请输入操作人姓名"></el-input>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content search-grid-content">
                        <label class="search-label">充值类型：</label>
                        <el-select class="search_input el-input" v-model="search.rechargeType" placeholder="请选择充值类型"
                                   clearable>
                            <el-option
                                    v-for="item in rechargeTypeList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content search-grid-content">
                        <label class="search-label">记账时间：</label>
                        <el-date-picker class="search_input" style="margin: 0"
                                        v-model="search.start"
                                        type="date"
                                        placeholder="开始时间"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        clearable>
                        </el-date-picker>
                        <span style="padding: 0 5px">-</span>
                        <el-date-picker class="search_input"
                                        v-model="search.end"
                                        type="date"
                                        placeholder="结束时间"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        clearable>
                        </el-date-picker>
                    </div>
                </el-col>
            </el-row>

            <el-button v-acl="['recharge:listlog']" type="primary" class="search-btn-primary" @click="serach"
                       icon="el-icon-search">搜索
            </el-button>
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
                    style="width: 100%; overflow-y: auto"
                    :max-height="maxHeight"
                    :header-cell-style="{
                    'background-color': '#F2F6FC',
                    'color':'#333333',
                    'padding':'8px 0'}">
                <el-table-column
                        type="index"
                        label="序号"
                        align="center"
                        width="80">
                </el-table-column>
                <el-table-column
                        prop="employeeName"
                        label="姓名"
                        :show-overflow-tooltip='true'
                        align="center"
                        width="">
                </el-table-column>
                <el-table-column
                        prop="employeeNo"
                        label="工号"
                        :show-overflow-tooltip='true'
                        align="center"
                        width="">
                </el-table-column>
                <el-table-column
                        prop="cardNo"
                        label="卡号"
                        :show-overflow-tooltip='true'
                        align="center"
                        width="">
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        label="记账时间"
                        :show-overflow-tooltip='true'
                        align="center"
                        width="">
                </el-table-column>
                <el-table-column
                        prop="money"
                        label="充值金额"
                        :show-overflow-tooltip='true'
                        align="center"
                        width="">
                </el-table-column>
                <el-table-column
                        prop="balance"
                        label="卡余额"
                        :show-overflow-tooltip='true'
                        align="center"
                        width="">
                </el-table-column>
                <el-table-column
                        prop="type"
                        label="充值类型"
                        :show-overflow-tooltip='true'
                        align="center"
                        width="">
                </el-table-column>

                <el-table-column
                        prop="creatorName"
                        label="操作人"
                        :show-overflow-tooltip='true'
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
                maxHeight: 1000,
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
            this.maxHeight = this.$ViewportSize - 260
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