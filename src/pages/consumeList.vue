<template>
    <div>
        <hr style="height: 2px;background-color: #5286FF;border:none;margin-bottom: 12px;">
        <div v-if="isSearchVisible" class="search" ref="search">

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
                        <el-input class="search_input" v-model="search.empNo" placeholder="请输入卡号" clearable></el-input>
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
                        <label class="search-label">消费方式：</label>
                        <el-select class="search_input el-input" v-model="search.orderType" placeholder="请选择消费方式"
                                   clearable>
                            <el-option
                                    v-for="item in orderTypeList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content search-grid-content">
                        <label class="search-label">消费时间：</label>
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

            <el-button type="primary" @click="serach" class="search-btn-primary" icon="el-icon-search">搜索</el-button>
        </div>

        <div class="option-menu clearfix">
            <el-button type="primary" class="search-btn" @click="toggleSearch"
                       icon="el-icon-search"
                       style="float: right;"/>
        </div>

        <el-table
                :data="tableData"
                stripe
                border
                style="width: 100%"
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
                    align="center"
                    :show-overflow-tooltip='true'
                    width="">
            </el-table-column>
            <el-table-column
                    prop="employeeNo"
                    label="工号"
                    align="center"
                    :show-overflow-tooltip='true'
                    width="100px">
            </el-table-column>
            <el-table-column
                    prop="cardNo"
                    label="卡号"
                    align="center"
                    :show-overflow-tooltip='true'
                    width="">
            </el-table-column>
            <el-table-column
                    prop="createTime"
                    label="消费时间"
                    :show-overflow-tooltip='true'
                    align="center"
                    width="">
            </el-table-column>
            <el-table-column
                    label="消费金额"
                    align="center"
                    :show-overflow-tooltip='true'
                    width=""
                    prop="money">
            </el-table-column>
            <el-table-column
                    prop="balance"
                    label="卡余额"
                    :show-overflow-tooltip='true'
                    align="center"
                    width="">
            </el-table-column>

            <el-table-column
                    prop="machineNo"
                    label="卡机名称"
                    :show-overflow-tooltip='true'
                    align="center"
                    width="">
            </el-table-column>


            <el-table-column
                    prop="type"
                    label="消费方式"
                    align="center"
                    :show-overflow-tooltip='true'
                    width="">
            </el-table-column>

            <el-table-column
                    prop="channel"
                    label="消费类型"
                    :show-overflow-tooltip='true'
                    align="center"
                    width="">
            </el-table-column>

            <el-table-column
                    prop="description"
                    label="补扣描述"
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
                maxHeight: 1000,
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
            this.maxHeight = this.$ViewportSize - 300
        },

        methods: {
            serach() {
                this.search.page = 1
                this.getList();
            },

            toggleSearch() {
                this.isSearchVisible = !this.isSearchVisible
                if (this.isSearchVisible === true) {
                    this.$nextTick(() => {
                        let height = this.$refs.search.offsetHeight;
                        //
                        this.maxHeight = this.$ViewportSize - 300 - height + 1
                    })
                } else {
                    this.maxHeight = this.$ViewportSize - 300
                }
            },

            //获取列表数据
            async getList() {
                let res = await list(this.search);
                if (res.code === 1000) {
                    this.total = res.data.total;
                    this.currentPage = res.data.currentPage;
                    this.tableData = res.data.data
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