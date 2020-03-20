<template>
    <div>
        <hr style="height: 2px;background-color: #5286FF;border:none;margin-bottom: 12px;">
        <div v-if="isSearchVisible" class="search" ref="search">

            <el-row :gutter="20" class="search-row">
                <el-col :span="8">
                    <div class="grid-content search-grid-content">
                        <label class="search-label">登录人：</label>
                        <el-input class="search_input" v-model="search.empName" placeholder="请输入姓名"></el-input>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content search-grid-content">
                        <label class="search-label">登录时间：</label>
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
                       style="float: right;"></el-button>
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
                    prop="empName"
                    label="登录人"
                    align="center"
                    :show-overflow-tooltip='true'
                    width="">
            </el-table-column>
            <el-table-column
                    prop="loginTime"
                    label="登录时间"
                    align="center"
                    :show-overflow-tooltip='true'
                    width="">
            </el-table-column>
            <el-table-column
                    prop="ip"
                    label="登录ip"
                    align="center"
                    :show-overflow-tooltip='true'
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
    import {listLogin} from '@/api/log'

    export default {
        name: "loginLog",
        inject: ['reload'],
        data() {
            return {
                isSearchVisible: false,
                currentPage: 1,
                total: 1,
                tableData: [],
                maxHeight: 1000,
                search: {
                    "empName": "",
                    "start": "",
                    "end": "",
                    "page": 0,
                    "size": 0,
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
                let res = await listLogin(this.search);
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

<style scoped>

</style>