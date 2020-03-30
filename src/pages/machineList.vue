<template>
    <div>
        <hr style="height: 2px;background-color: #5286FF;border:none;margin-bottom: 12px;">
        <div class="option-menu">
            <el-button type="primary" class="add-btn" @click="addVisible = true" icon="el-icon-plus"
                       v-acl="['machine:add']">新增卡机
            </el-button>
        </div>
        <div>
            <el-table
                    :data="pageData"
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
                        width="80px">
                </el-table-column>
                <el-table-column
                        prop="code"
                        label="卡机编号"
                        align="center"
                        :show-overflow-tooltip='true'>
                </el-table-column>

                <el-table-column
                        prop="name"
                        label="卡机名称"
                        align="center"
                        :show-overflow-tooltip='true'>
                </el-table-column>

                <el-table-column
                        prop="location"
                        label="卡机位置"
                        align="center"
                        :show-overflow-tooltip='true'>
                </el-table-column>

                <el-table-column
                        prop="description"
                        label="描述"
                        align="center"
                        :show-overflow-tooltip='true'>
                </el-table-column>

                <el-table-column
                        prop="operation"
                        label="操作"
                        align="center"
                        width="180">
                    <template slot-scope="scope">
                        <el-button type="text" size="small"
                                   @click="get(scope.row.id)"
                                   v-acl="['machine:update']">修改
                        </el-button>
                        <el-button type="text" size="small"
                                   class="delete-btn"
                                   v-acl="['machine:delete']"
                                   @click="remove(scope.row.id)">
                            删除
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


        <!--        新增弹窗-->
        <el-dialog class="dialog"
                   :title="'新增'"
                   :close-on-click-modal="false"
                   :visible.sync="addVisible"
                   @close="addClose"
                   width="30%">
            <el-form ref="addForm" :model="addForm" :rules="rules" label-width="60px">
                <el-form-item prop="code" label="卡机编号">
                    <el-input type="text" v-model.trim="addForm.code" auto-complete="off" placeholder="编号"
                              clearable/>
                </el-form-item>
                <el-form-item prop="name" label="卡机名称">
                    <el-input type="text" v-model.trim="addForm.name" auto-complete="off" placeholder="名称"
                              clearable/>
                </el-form-item>
                <el-form-item prop="location" label="卡机位置">
                    <el-input type="text" v-model.trim="addForm.location" auto-complete="off" placeholder="位置"
                              clearable/>
                </el-form-item>
                <el-form-item prop="description" label="描述">
                    <el-input type="textarea" v-model.trim="addForm.description" auto-complete="off" clearable
                              placeholder="描述"/>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer" style="text-align: center">
            <el-button class="dialog-btn-reset" @click="resetAddForm('addForm')">重 置</el-button>
            <el-button type="primary" class="dialog-btn-normal" @click="addSubmit()">保存</el-button>
        </span>

        </el-dialog>

        <!--        编辑弹窗-->
        <el-dialog class="dialog"
                   :title="'修改'"
                   :close-on-click-modal="false"
                   :visible.sync="editVisible"
                   @close="editClose"
                   width="30%">
            <el-form ref="editForm" :model="editForm" :rules="rules" label-width="80px">
                <el-form-item prop="code" label="卡机编号">
                    <el-input type="text" v-model.trim="editForm.code" auto-complete="off" placeholder="编号"
                              clearable/>
                </el-form-item>
                <el-form-item prop="name" label="卡机名称">
                    <el-input type="text" v-model.trim="editForm.name" auto-complete="off" placeholder="名称"
                              clearable/>
                </el-form-item>
                <el-form-item prop="location" label="卡机位置">
                    <el-input type="text" v-model.trim="editForm.location" auto-complete="off" placeholder="位置"
                              clearable/>
                </el-form-item>
                <el-form-item prop="description" label="描述">
                    <el-input type="textarea" v-model.trim="editForm.description" auto-complete="off" clearable
                              placeholder="描述"/>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer" style="text-align: center">
            <el-button class="dialog-btn-reset" @click="resetEditForm('editForm')">重 置</el-button>
            <el-button type="primary" class="dialog-btn-normal" @click="editSubmit()">保存</el-button>
        </span>

        </el-dialog>


    </div>
</template>
<script>
    import * as machine from '@/api/machine'

    export default {
        inject: ['reload'],
        data() {
            return {
                currentPage: 1,
                total: 1,
                addForm: {},
                maxHeight: 1000,
                editForm: {},
                editFormCopy: {},
                search: {
                    page: 0,
                    size: 10,
                },
                pageData: [],
                addVisible: false,
                editVisible: false,
                isSearchVisible: false, //搜索
                rules: {
                    code: [
                        {required: true, message: '请输入编号', trigger: 'blur'},
                        {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'},
                        {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
                    ],
                    location: [
                        {required: true, message: '请输入位置', trigger: 'blur'},
                        {min: 1, max: 20, message: '长度在 1 到 20 个汉字或字符', trigger: 'blur'}
                    ],
                    description: [
                        {min: 1, max: 100, message: '长度在 1 到 100 个汉字或字符', trigger: 'blur'}
                    ]
                },
            }
        },
        mounted: function () {
            this.maxHeight = this.$ViewportSize - 300
            this.page();
        },

        created() {

        },
        methods: {
            addClose() {
                this.addVisible = false;
                this.addForm = {}
            },
            editClose() {
                this.editVisible = false;
                this.addForm = {}
            },
            addSubmit() {
                this.$refs['addForm'].validate((valid) => {
                    if (valid) {
                        this.add()
                    } else {
                        return false;
                    }
                });
            },
            editSubmit() {
                this.$refs['editForm'].validate((valid) => {
                    if (valid) {
                        this.edit()
                    } else {
                        return false;
                    }
                });
            },
            async add() {
                let res = await machine.add(this.addForm)
                if (res.code === 1000) {
                    this.$message.success('保存成功')
                    this.addVisible = false;
                    this.page()
                }
            },
            async get(id) {
                let res = await machine.get(id)
                if (res.code === 1000) {
                    this.editVisible = true
                    let data = res.data
                    this.editForm = data
                    for (let x in data) {
                        this.editFormCopy[x] = data[x]
                    }
                }
            },
            async edit() {
                let res = await machine.update(this.editForm)
                if (res.code === 1000) {
                    this.$message.success('修改成功')
                    this.editVisible = false;
                    this.page()
                }
            },
            async remove(id) {
                this.$confirm('确定删除该卡机？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.removeMachine(id)
                }).catch(() => {

                });

            },
            async removeMachine(id) {
                let res = await machine.remove(id)
                if (res.code === 1000) {
                    this.$message.success('删除成功')
                    this.reload()
                }
            },
            async page() {
                let res = await machine.page(this.search);
                if (res.code === 1000) {
                    this.total = res.data.total;
                    this.currentPage = res.data.currentPage;
                    this.pageData = res.data.data
                }
            },
            //分页
            handleSizeChange(val) {
                this.search.size = val
                this.page();
            },
            handleCurrentChange(val) {
                this.search.page = val
                this.page();
            },
            resetAddForm(formName) {
                this.$refs[formName].resetFields();
            },
            resetEditForm(formName) {
                let that = this
                for (let i in this.editFormCopy) {
                    that.editForm[i] = that.editFormCopy[i]
                }
                this.$refs[formName].clearValidate();
            },
        }
    }
</script>

<style>
    .page {
        margin-top: 20px;
    }

    .el-select {
        display: block;
    }

    .el-tree {
        background-color: #F2F6FC;
    }

    .el-tree-node__content {
        padding: 5px 0 5px;
        border-bottom: 1px solid #fff;
    }

    .el-tree-node__content:hover {
        background-color: #C7C9E1;
    }

</style>
