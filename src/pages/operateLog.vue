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
                        <label class="search-label">操作功能：</label>
                        <el-input class="search_input" v-model="search.action" placeholder="请输入动作"></el-input>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content search-grid-content">
                        <label class="search-label">操作模块：</label>
                        <el-input class="search_input" v-model="search.module" placeholder="请输入模块"></el-input>
                    </div>
                </el-col>
            </el-row>

            <el-row :gutter="20" class="search-row">
                <el-col :span="8">
                    <div class="grid-content search-grid-content">
                        <label class="search-label">操作时间：</label>
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
                    label="姓名"
                    align="center"
                    :show-overflow-tooltip='true'
                    width="">
            </el-table-column>
            <el-table-column
                    prop="empNo"
                    label="工号"
                    align="center"
                    :show-overflow-tooltip='true'
                    width="">
            </el-table-column>
            <el-table-column
                    prop="module"
                    label="操作模块"
                    align="center"
                    :show-overflow-tooltip='true'
                    width="">
            </el-table-column>
            <el-table-column
                    prop="action"
                    label="操作功能"
                    align="center"
                    :show-overflow-tooltip='true'
                    width="">
            </el-table-column>
            <el-table-column
                    prop="detail"
                    label="详情"
                    align="center"
                    :show-overflow-tooltip='true'
                    width="">
            </el-table-column>
            <el-table-column
                    prop="operationTime"
                    label="操作时间"
                    align="center"
                    :show-overflow-tooltip='true'
                    width="170">
            </el-table-column>
            <el-table-column
                    prop="operation"
                    label="操作"
                    align="center"
                    width="120">
                <template slot-scope="scope">
                    <el-button type="text" size="small"
                               v-acl="['icCard:patch']"
                               @click="getDetail(scope.row.id)">查看
                    </el-button>
                </template>
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

        <el-dialog class="dialog"
                   title="查看详情"
                   :close-on-click-modal="false"
                   :visible.sync="isShowVisible" width="40%">
            <el-form ref="form" :model="form" disabled label-width="100px" label-position="right">
                <el-form-item prop="empName" label="姓名">
                    <el-input type="text" v-model="form.empName"></el-input>
                </el-form-item>
                <el-form-item prop="empNo" label="工号">
                    <el-input type="text" v-model="form.empNo"></el-input>
                </el-form-item>
                <el-form-item prop="operationTime" label="操作时间">
                    <el-input type="text" v-model="form.operationTime"></el-input>
                </el-form-item>
                <el-form-item prop="module" label="操作模块">
                    <el-input type="text" v-model="form.module"></el-input>
                </el-form-item>
                <el-form-item prop="action" label="操作动作">
                    <el-input type="text" v-model="form.action"></el-input>
                </el-form-item>
                <el-form-item prop="detail" label="详情">
                    <el-input type="textarea" v-model="form.detail" rows="6"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" class="dialog-btn-normal" @click="isShowVisible = false" :disabled="false">关 闭
                </el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import {listOperation, get} from '@/api/log'

    export default {
        name: "operateLog",
        inject: ['reload'],
        data() {
            return {
                isSearchVisible: false,
                currentPage: 1,
                total: 1,
                tableData: [],
                maxHeight: 1000,
                isShowVisible: false,
                search: {
                    action: '',
                    empName: '',
                    end: '',
                    module: "",
                    page: 0,
                    size: 0,
                    start: ''
                },
                form: {}
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
                let res = await listOperation(this.search);
                if (res.code === 1000) {
                    this.total = res.data.total;
                    this.currentPage = res.data.currentPage;
                    this.tableData = res.data.data
                } else {

                }
            },

            //查看详情
            async getDetail(id) {
                this.isShowVisible = true;
                let res = await get(id);
                if (res.code === 1000) {
                    this.form = res.data
                } else {

                }
            },

            async showEmployee() { //获取员工数据
                let res = await get(this.form1.id);
                if (res.code === 1000) {
                    this.form = res.data
                } else {

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

<style>
    .el-tooltip__popper {
        max-width: 20%;
    }
</style>