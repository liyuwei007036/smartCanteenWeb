<template>
    <div>
        <hr style="height: 2px;background-color: #5286FF;border:none;margin-bottom: 12px;">
        <div class="option-menu">
            <el-button type="primary" class="add-btn" @click="addNodes()" icon="el-icon-plus"
                       v-acl="['origination:add']">新增组织
            </el-button>
        </div>

        <el-table :indent="16" v-acl="['origination:view']"
                  :data="tableData"
                  row-key="id"
                  border
                  lazy
                  :load="load"
                  :stripe="true"
                  :tree-props="{children: 'kids', hasChildren: 'hasChildren'}"
                  style="width: 100%; overflow-y: auto"
                  :max-height="maxHeight"
                  :header-cell-style="{
                    'background-color': '#F2F6FC',
                    'color':'#333333',
                    'padding':'8px 0'}">
            <el-table-column
                    prop="name"
                    label="组织名称"
                    width=""
                    align="left">
            </el-table-column>

            <el-table-column
                    prop="description"
                    label="备注"
                    align="center"
                    :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
                    prop="operation"
                    label="操作"
                    align="center"
                    width="180">
                <template slot-scope="scope">
                    <el-button @click="addNodes(scope.row.id)" type="text" size="small" v-acl="['origination:add']">
                        新增子组织
                    </el-button>
                    <el-button type="text" size="small" @click="editNodes(scope.row.id)" v-acl="['origination:update']">
                        修改
                    </el-button>
                    <el-button type="text" size="small" class="delete-btn" @click="deleted(scope.row.id)"
                               v-acl="['origination:deleted']">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--        弹窗-->
        <el-dialog class="dialog"
                   :title="this.isUpdate?'修改':'新增'"
                   :close-on-click-modal="false"
                   :visible.sync="visible"
                   @close="close"
                   width="30%">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="right" style="padding-right: 10px;">
                <el-form-item prop="name" label="组织名称">
                    <el-input type="text" v-model.trim="form.name" auto-complete="off" placeholder="组织名称"
                              clearable></el-input>
                </el-form-item>
                <el-form-item prop="description" label="备注">
                    <el-input type="textarea" v-model.trim="form.description" auto-complete="off" clearable
                              placeholder="备注"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer" style="text-align: center">
            <el-button class="dialog-btn-reset" @click="resetForm('form')">重 置</el-button>
            <el-button type="primary" class="dialog-btn-normal" @click="handleSubmit('form')">保存</el-button>
        </span>
        </el-dialog>
    </div>
</template>
<script>
    import {add, deleted, get, getNodes, getRoot, update} from '@/api/origination';

    export default {
        inject: ['reload'],
        data() {
            return {
                visible: false,
                isUpdate: true,
                tableData: [],
                maxHeight: 1000,
                childrenTableData: [{
                    name: '',
                    description: ''
                }],
                form: {
                    description: "",
                    id: '',
                    name: "",
                    parentId: 0
                },
                copyForm: {
                    description: "",
                    id: '',
                    name: "",
                    parentId: 0
                },
                rules: {
                    name: [
                        {required: true, message: '请输入组织名称', trigger: 'blur'},
                        {min: 1, max: 20, message: '长度在 1 到 20 个汉字或字符', trigger: 'blur'}
                    ],
                    description: [
                        {min: 1, max: 255, message: '长度在 1 到 255 个汉字或字符', trigger: 'blur'}
                    ]
                },
            };
        },
        mounted() {
            this.root();
            this.maxHeight = this.$ViewportSize - 260
        },
        methods: {
            close() {
                this.visible = false
                this.form = {};
                this.copyForm = {};
            },
            async load(tree, treeNode, resolve) {
                let res = await getNodes(tree.id)
                if (res.code === 1000) {
                    resolve(res.data)
                }
            },

            //获取根结点数据
            async root() {
                let res = await getRoot();
                if (res.code === 1000) {
                    this.tableData = res.data
                }
            },

            // 点击编辑按钮
            editNodes(id) {
                this.visible = true;
                this.isUpdate = true;
                this.form = {};
                this.form.id = id;
                this.$nextTick(() => {
                    this.getNodes()
                })
            },

            // 弹窗获取节点数据
            async getNodes() {
                let that = this
                let res = await get(this.form.id)
                if (res.code === 1000) {
                    this.form = res.data
                    for (let m in res.data) {
                        that.copyForm[m] = res.data[m]
                    }
                }
            },

            //提交表单
            handleSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.isUpdate === true) {
                            this.updateNode()
                        } else {
                            this.addNode()
                        }
                    } else {
                        return false;
                    }
                });
            },

            //更新数据
            async updateNode() {
                let res = await update(this.form)
                if (res.code === 1000) {
                    this.$message.success('保存成功');
                    this.visible = false;
                    this.reload()
                }
            },

            //新增数据
            async addNode() {
                let res = await add(this.form)
                if (res.code === 1000) {
                    this.$message.success('保存成功');
                    this.visible = false;
                    this.reload()
                }
            },

            //点击新增按钮
            addNodes(id) {
                // this.$refs.form.resetFields()
                this.isUpdate = false;
                this.visible = true;
                this.form = {};
                this.form.parentId = id || 0;
            },

            //点击删除按钮
            deleted(id) {
                this.$confirm('确定删除该节点？删除后该节点下所有子节点均被删除', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deletedNode(id)
                }).catch(() => {

                });
            },

            //删除数据
            async deletedNode(id) {
                let res = await deleted(id)
                if (res.code === 1000) {
                    this.$message.success('删除成功');
                    this.visible = false;
                    this.reload()
                }
            },

            resetForm(formName) {
                this.$refs[formName].clearValidate();
                let data = this.copyForm
                let that = this
                for (let m in data) {
                    that.form[m] = data[m]
                }
            }
        },
    }

</script>

<style>
    .el-tooltip__popper {
        max-width: 20%;
    }

    .el-tooltip__popper, .el-tooltip__popper.is-dark {
        /*background: #fff;*/
        /*min-width: 150px;*/
        /*border-radius: 4px;*/
        /*border: 1px solid #ebeef5;*/
        /*padding: 12px;*/
        /*z-index: 2000;*/
        /*color: #606266;*/
        /*line-height: 1.4;*/
        /*text-align: justify;*/
        /*font-size: 14px;*/
        /*box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);*/
        /*word-break: break-all;*/
    }

</style>

