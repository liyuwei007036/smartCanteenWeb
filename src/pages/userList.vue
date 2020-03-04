<template>
    <div>
        <div class="search">
            <el-input v-model="search.name" placeholder="请输入用户名" style="width:240px"></el-input>
            <el-input v-model="search.account" placeholder="请输入账号" style="width:240px"></el-input>
            <el-button type="primary" @click="serach">搜索</el-button>
            <el-button type="primary" @click="addOrUpdateUser()">新增</el-button>
        </div>

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
                    label="用户名"
                    align="center"
                    width="180">
            </el-table-column>

            <el-table-column
                    prop="account"
                    label="账号"
                    align="center"
                    width="180">
            </el-table-column>

            <el-table-column
                    prop="origination"
                    label="所属组织"
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
                    <el-button type="text" size="small" @click="addOrUpdateUser(scope.row.id)">编辑</el-button>
                    <el-button type="text" size="small" @click="deleteUser(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

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

        <!--        弹窗-->
        <el-dialog
                :title="!form.id?'新增':'编辑'"
                :close-on-click-modal="false"
                :visible.sync="visible">
            <el-form ref="form" :model="form">
                <el-form-item prop="name" label="用户名">
                    <el-input type="text" v-model="form.name" auto-complete="off" placeholder="姓名"></el-input>
                </el-form-item>

                <el-form-item prop="account" label="账号">
                    <el-input type="text" v-model="form.account" auto-complete="off" placeholder="账号"></el-input>
                </el-form-item>

                <el-form-item prop="role" label="角色">
                    <el-input type="text" v-model="form.role" auto-complete="off" placeholder="角色"></el-input>
                </el-form-item>

                <el-form-item prop="role" label="密码">
                    <el-input type="text" v-model="form.password" auto-complete="off" placeholder="密码"></el-input>
                </el-form-item>


                <el-form-item prop="role" label="确认密码">
                    <el-input type="text" v-model="form.checkPassword" auto-complete="off"
                              placeholder="确认密码"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" style="width:100%;" @click="handleSubmit('form')">保存
                    </el-button>
                </el-form-item>

            </el-form>

        </el-dialog>
    </div>
</template>

<script>
    import {list} from '@/api/user';
    import {get} from '@/api/user';
    import {update} from '@/api/user';
    import {add} from '@/api/user';
    import {deleted} from '@/api/user';

    export default {
        name: "userList",
        inject: ['reload'],
        data() {
            return {
                currentPage: 1,
                total: 1,
                tableName: '',
                visible: false,
                tableData: [{
                    account: '',
                    name: '',
                    role: '',
                    organization: '',
                    createTime: '',
                }],
                search: {
                    account: '',
                    name: '',
                    page: 1,
                    size: 10
                },
                form: {
                    id: '',
                    account: '',
                    name: '',
                    role: '',
                    password: '',
                    checkPassword: ''
                }
            }
        },

        mounted: function () {
            this.getList();
        },

        methods: {
            //获取列表数据
            async getList() {
                let res = await list(this.search);
                console.log(res);
                if (res.code === 1000) {
                    this.total = res.data.total;
                    this.currentPage = res.data.currentPage;
                    this.tableData = res.data.userList
                } else {
                    this.$message.error(res.msg);
                }
            },

            //搜索
            serach() {
                this.getList()
            },

            // 新增/编辑触发弹窗
            addOrUpdateUser(id) {
                this.visible = true;
                this.form = {};
                this.form.id = id || 0;
                this.$nextTick(() => {
                    if (this.form.id > 0) {
                        this.getUser()
                    }
                })
            },

            //获取用户数据
            async getUser() {
                let res = await get(this.form.id);
                console.log(res)
                if (res.code === 1000) {
                    this.form = res.data
                } else {
                    this.$message.error(res.msg);
                }
            },

            //保存弹窗
            handleSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log(this.form.id)
                        if (this.form.id > 0) {
                            this.updateForm()
                        } else {
                            this.addForm()
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            //更新数据
            async updateForm() {
                let res = await update(this.form)
                if (res.code === 1000) {
                    this.$message.success('保存成功');
                    this.visible = false;
                    this.reload()
                }
            },

            //保存数据
            async addForm() {
                let res = await add(this.form)
                if (res.code === 1000) {
                    this.$message.success('保存成功');
                    this.visible = false;
                    this.reload()
                }
            },


            //删除用户
            async deleteUser(id) {
                let res = await deleted(id)
                console.log(res)
                if (res.code === 1000) {
                    this.$message.success('删除成功');
                    this.getList()
                }
            },

            //分页
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },

            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
            }
        }
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