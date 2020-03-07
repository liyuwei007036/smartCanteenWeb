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
            <el-button type="primary" class="search-btn" @click="isSerachVisible = !isSerachVisible"
                       icon="el-icon-search"
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
                        prop="mobile"
                        label="手机号"
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
                        <el-button @click="getEmployee(scope.row.id)" type="text" size="small">查看</el-button>
                        <el-button type="text" size="small" @click="addOrUpdateEmployee(scope.row.id)">编辑</el-button>
                        <el-button type="text" size="small" class="delete-btn" @click="deletedEmployee(scope.row.id)">删除</el-button>
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
        <!--        查看弹窗-->

        <el-dialog
                title="查看"
                :close-on-click-modal="false"
                :visible.sync="isShowVisible" width="40%">
            <el-form ref="form1" :model="form1" disabled label-width="80px" label-position="left">
                <el-form-item prop="name" label="姓名">
                    <el-input type="text" v-model.trim="form1.name" auto-complete="off" placeholder="姓名"></el-input>
                </el-form-item>
                <el-form-item prop="no" label="账号">
                    <el-input type="text" v-model.trim="form1.no" auto-complete="off" placeholder=账号></el-input>
                </el-form-item>
                <el-form-item prop="idCard" label="身份证号">
                    <el-input type="text" v-model.trim="form1.idCard" auto-complete="off" placeholder="身份证号"></el-input>
                </el-form-item>
                <el-form-item prop="mobile" label="手机号">
                    <el-input type="text" v-model.trim="form1.mobile" auto-complete="off" placeholder="手机号"></el-input>
                </el-form-item>
                <el-form-item prop="password" label="卡密码">
                    <el-input type="password" v-model.trim="form1.password" auto-complete="off" placeholder="密码"></el-input>
                </el-form-item>
                <el-form-item prop="checkpassword" label="确认密码">
                    <el-input type="password" v-model.trim="form1.confirmPassword" auto-complete="off"
                              placeholder="请再次输入密码"></el-input>
                </el-form-item>
                <el-form-item prop="originationName" label="所属组织">
                    <el-input type="password" v-model.trim="form1.originationName" auto-complete="off"
                              placeholder="请选择组织"></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="roles">
                    <el-select v-model="form1.roles" placeholder="请选择角色">
                        <el-option
                                v-for="item in roleList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="isShowVisible = false">关 闭</el-button>
            </span>

        </el-dialog>

    </div>
</template>

<script>
    import {list} from '@/api/employeeList';
    import EditDialog from '@/components/EditDialog';
    import {get} from '@/api/employeeList';
    import {deleted} from '@/api/employeeList';

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
                    mobile: ''
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
                form1: {
                    id: '',
                    name: '',
                    no: '',
                    idCard: '',
                    mobile: '',
                    password: '',
                    confirmPassword: '',
                    originationId: 1,
                    originationName: "",
                    roles: [],
                },
                roleList: [{
                    id: 0, name: 'ceshi'
                }],
                isVisible: false, //编辑新增弹窗
                isShowVisible: false,//查看弹窗
                isSerachVisible: false, //搜索
            }
        },
        mounted: function () {
            this.getList();
        },

        methods: {
            async getList() { //获取数据
                let res = await list(this.search);
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

            //查看员工
            getEmployee(id) {
                this.isShowVisible = true;
                this.form1.id = id;
                console.log(this.form1.id)
                this.$nextTick(() => {
                    this.showEmployee()
                })
            },

            async showEmployee() { //获取员工数据
                let res = await get(this.form1.id);
                if (res.code === 1000) {
                    this.form1 = res.data
                } else {
                    this.$message.error(res.msg);
                }
            },

            //删除员工
            async deletedEmployee(id) {
                let res = await deleted(id)
                console.log(res)
                if (res.code === 1000) {
                    this.$message.success('删除成功');
                    this.getList()
                }
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

    .el-select {
        display: block;
    }
</style>
