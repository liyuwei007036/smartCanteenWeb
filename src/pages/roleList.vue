<template>
    <div>

        <hr style="height: 2px;background-color: #5286FF;border:none;margin-bottom: 12px;">
        <div v-if="isSearchVisible" class="search" ref="search">
            <el-row :gutter="20" class="search-row">
                <el-col :span="8">
                    <div class="grid-content search-grid-content">
                        <label class="search-label">角色名称：</label>
                        <el-input class="search_input" v-model="search.name" placeholder="请输入角色名称"></el-input>
                    </div>
                </el-col>
            </el-row>

            <el-button type="primary" class="search-btn-primary" @click="serach" icon="el-icon-search">搜索</el-button>
        </div>

        <div class="option-menu">
            <el-button type="primary" v-acl="['role:add']" class="add-btn" @click="addOrUpdateRole()"
                       icon="el-icon-plus">新增角色
            </el-button>
            <el-button type="primary" class="search-btn" @click="toggleSearch"
                       icon="el-icon-search"
                       style="float: right;"/>
        </div>
        <div>
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
                        width="180px">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="角色"
                        align="center"
                        width="">
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        label="创建时间"
                        align="center"
                        :show-overflow-tooltip='true'
                        width="">
                </el-table-column>
                <el-table-column
                        prop="operation"
                        label="操作"
                        align="center"
                        width="">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.canEdit === true" type="text" size="small" v-acl="['role:update']"
                                   @click="addOrUpdateRole(scope.row.id)">修改
                        </el-button>
                        <el-button v-if="scope.row.canEdit === true" type="text" size="small" class="delete-btn"
                                   v-acl="['role:deleted']"
                                   @click="deleted(scope.row.id)">删除
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

        <!--        弹窗-->
        <el-dialog class="dialog"
                   :title="!form.id?'新增':'修改'"
                   :close-on-click-modal="false"
                   :visible.sync="visible"
                   width="40%">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="left">
                <el-form-item prop="name" label="角色名称">
                    <el-input type="text" v-model.trim="form.name" auto-complete="off" placeholder="角色名称"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button class="dialog-btn-reset" @click="resetForm('form')">重 置</el-button>
            <el-button type="primary" class="dialog-btn-normal" @click="handleSubmit('form')">保存</el-button>
        </span>

        </el-dialog>
    </div>
</template>

<script>
    import {add, deleted, get, list, update} from '@/api/role';

    export default {
        name: "roleList",
        inject: ['reload'],
        data() {
            return {
                currentPage: 1,
                total: 1,
                tableName: '',
                visible: false,
                isSearchVisible: false,
                maxHeight: 1000,
                tableData: [],
                search: {
                    name: '',
                    page: 1,
                    size: 10
                },
                form: {
                    id: '',
                    name: '',
                },
                permissions: [],
                rules: {
                    name: [
                        {required: true, message: '请输入角色名称', trigger: 'blur'},
                        {min: 1, max: 20, message: '长度在 1 到 20 个汉字或字符', trigger: 'blur'}
                    ]
                },
            }
        },

        mounted: function () {
            this.getList();
            this.maxHeight = this.$ViewportSize - 300
        },

        methods: {
            //获取列表数据
            async getList() {
                let res = await list(this.search);
                if (res.code === 1000) {
                    this.total = res.data.total;
                    this.currentPage = res.data.currentPage;
                    this.tableData = res.data.data
                } else {

                }
            },


            //搜索
            serach() {
                this.search.page = 1
                this.getList()
            },

            // 新增/编辑触发弹窗
            addOrUpdateRole(id) {
                this.visible = true;
                this.form = {};
                this.form.id = id || 0;
                this.$nextTick(() => {
                    if (this.form.id > 0) {
                        this.getRole()
                    }
                })
            },

            //获取用户数据
            async getRole() {
                let res = await get(this.form.id);

                if (res.code === 1000) {
                    this.form = res.data
                } else {

                }
            },

            //保存弹窗
            handleSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {

                        if (this.form.id > 0) {
                            this.updateForm()
                        } else {
                            this.addForm()
                        }
                    } else {

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

                if (res.code === 1000) {
                    this.$message.success('删除成功');
                    this.getList()
                }
            },

            //点击删除按钮
            async deleted(id) {
                this.$confirm('确定删除该角色？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteUser(id)
                }).catch(() => {

                });
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

            resetForm(formName) {
                this.$refs[formName].resetFields();
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
        }
    }
</script>

<style>


    .page {
        margin-top: 20px;
    }
</style>