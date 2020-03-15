<template>
    <div>
        <div v-if="isSearchVisible" class="search" style="border-bottom: 1px solid #eaeaea;padding-bottom: 15px">
            <div class="search-group" style="padding: 5px 0;display: flex;flex: 1">
                <el-input class="search_input" v-model="search.empName" placeholder="请输入姓名">
                    <template slot="prepend">姓名</template>
                </el-input>

                <el-input class="search_input" v-model="search.empNo" placeholder="请输入账号">
                    <template slot="prepend">账号</template>
                </el-input>

                <el-input class="search_input" v-model="search.cardNo" placeholder="请输入卡号">
                    <template slot="prepend">卡号</template>
                </el-input>

                <el-input class="search_input" v-model="search.operatorName" placeholder="请输入操作人姓名">
                    <template slot="prepend">操作人</template>
                </el-input>

            </div>
            <div class="search-group" style="padding: 5px 0;display: flex;flex: 1">

                <el-select class="search_input" v-model="search.orderType" placeholder="请选择消费类型" clearable>
                    <el-option
                            v-for="item in orderTypeList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>

                <el-date-picker class="search_input"
                                v-model="search.start"
                                type="date"
                                placeholder="消费开始时间" clearable>
                </el-date-picker>

                <el-date-picker class="search_input"
                                v-model="search.end"
                                type="date"
                                placeholder="消费结束时间" clearable>
                </el-date-picker>

            </div>

            <el-button type="primary" @click="serach" icon="el-icon-search">搜索</el-button>
        </div>

        <div class="option-menu clearfix">
            <el-button type="primary" class="search-btn" @click="toggleSearch"
                       icon="el-icon-search"
                       style="float: right;"></el-button>
        </div>

        <el-table
                :data="tableData"
                stripe
                border
                style="width: 100%; overflow-y: auto"
                :max-height="maxHeight">
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
                    width="100px">
            </el-table-column>
            <el-table-column
                    prop="cardNo"
                    label="卡号"
                    align="center"
                    width="">
            </el-table-column>
            <el-table-column
                    prop="createTime"
                    label="消费时间"
                    align="center"
                    width="">
            </el-table-column>
            <el-table-column
                    label="消费金额"
                    align="center"
                    width=""
                    prop="money">
            </el-table-column>
            <el-table-column
                    prop="balance"
                    label="消费后卡余额"
                    align="center"
                    width="">
            </el-table-column>

            <el-table-column
                    prop="machineNo"
                    label="终端编号"
                    align="center"
                    width="">
            </el-table-column>


            <el-table-column
                    prop="type"
                    label="消费方式"
                    align="center"
                    width="">
            </el-table-column>

            <el-table-column
                    prop="channel"
                    label="消费类型"
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

        <div class="page" align="right">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10,20,50, 75, 100]"
                    :page-size="1"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>

    </div>
</template>

<script>
    import {list} from '@/api/order'

    export default {
        name: "consumeList",
        inject: ['reload'],
        data() {
            return {
                isSearchVisible: false,
                currentPage: 1,
                total: 1,
                tableData: [],
                maxHeight: '',
                search: {
                    cardNo: "",
                    empName: "",
                    empNo: "",
                    start: "",
                    end: "",
                    money: 0,
                    orderType: "",
                    operatorName: "",
                    page: 0,
                    size: 10,
                },
                orderTypeList: [{
                    name: '正常',
                    id: 1
                }, {
                    name: '补扣',
                    id: 2
                }],
            }
        },

        mounted: function () {
            this.getList();
            this.maxHeight = this.$ViewportSize - 240
        },

        methods: {

            serach() {
                this.search.page = 1
                this.getList();
            },

            toggleSearch() {
                this.isSearchVisible = !this.isSearchVisible
            },

            //获取列表数据
            async getList() {
                let res = await list(this.search);
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
            },

        }
    }
</script>