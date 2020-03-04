<template>
    <div>
        <div v-if="isSerachVisible" class="search" style="border-bottom: 1px solid #eaeaea;padding-bottom: 15px">
            <el-input v-model="search.mobile" placeholder="请输入手机号" style="width:240px"></el-input>
            <el-input v-model="search.name" placeholder="请输入姓名" style="width:240px"></el-input>
            <el-input v-model="search.no" placeholder="请输入账号" style="width:240px"></el-input>
            <el-button type="primary" @click="serach" icon="el-icon-search">搜索</el-button>
        </div>
        <div class="option-menu">
            <el-button type="primary" class="add-btn" @click="addOrUpdateEmployee()" icon="el-icon-plus">新增人员
            </el-button>
            <el-button type="danger" class="del-btn" @click="addOrUpdateEmployee()" icon="el-icon-delete">删除</el-button>
            <el-button type="primary" class="search-btn" @click="isSerachVisible = !isSerachVisible" icon="el-icon-search"
                       style="float: right;"></el-button>
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
                        align="center"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="姓名"
                        align="center"
                        width="180">
                </el-table-column>

                <el-table-column
                        prop="no"
                        label="账号"
                        align="center"
                        width="180">
                </el-table-column>

                <el-table-column
                        prop="idCard"
                        label="卡号"
                        align="center"
                        width="180">
                </el-table-column>

                <el-table-column
                        prop="cardType"
                        label="卡类别"
                        align="center"
                        width="180">
                </el-table-column>

                <el-table-column
                        prop="organization"
                        label="所属组织"
                        align="center"
                        width="180">
                </el-table-column>

                <el-table-column
                        prop="cardPeriod"
                        label="卡有效期"
                        align="center"
                        width="180">
                </el-table-column>

                <el-table-column
                        prop="createTime"
                        label="创建时间"
                        align="center"
                        width="180">
                </el-table-column>

                <el-table-column
                        prop="operation"
                        label="操作"
                        align="center"
                        fixed="right"
                        width="180">
                    <template slot-scope="scope">
                        <el-button @click="editEmployee(scope.row)" type="text" size="small">查看</el-button>
                        <el-button type="text" size="small" @click="addOrUpdateEmployee(scope.row.id)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="page" align="right">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[50, 75, 100]"
                    :page-size="1"
                    hide-on-single-page
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>
        <!--        新增编辑弹窗-->
        <editdialog v-if="isVisible" ref="addOrUpdate"></editdialog>
    </div>
</template>

<script>
    import {employeeList} from '@/api/employeeList';
    import EditDialog from '@/components/EditDialog';

    export default {
        components: {
            editdialog: EditDialog
        },
        data() {
            return {
                currentPage: 1,
                total: 1,
                tableName: '',
                tableData: [{
                    name: '',
                    no: '',
                    idCard: '',
                    cardType: '',
                    organization: '',
                    cardPeriod: '',
                    createTime: '',
                }],
                search: {
                    mobile: "",
                    name: "",
                    no: "",
                    page: 1,
                    size: 10
                },
                editParams: {
                    id: 0,
                    idCard: "",
                    mobile: "",
                    name: "",
                    no: "",
                    password: ""
                },
                isVisible: false, //弹窗
                isSerachVisible: false //搜索
            }
        },
        mounted: function () {
            this.getList();
        },

        methods: {
            async getList() { //获取数据
                let res = await employeeList(this.search);
                console.log(res);
                if (res.code === 1000) {
                    this.total = res.data.total;
                    this.currentPage = res.data.currentPage;
                    this.tableData = res.data.data
                } else {
                    this.$message.error(res.msg);
                }
            },
// 新增修改触发方法
            addOrUpdateEmployee(id) {
                this.isVisible = true;
                this.$nextTick(() => {
                    this.$refs.addOrUpdate.init(id)
                })
            },

            serach() {
                this.getList()
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
            }
        },
    }
</script>

<style>
    .search {
        margin-bottom: 20px;
    }

    .page {
        margin-top: 20px;
    }
</style>
