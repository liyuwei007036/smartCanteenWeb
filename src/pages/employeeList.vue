<template>
    <div>
        <hr style="height: 2px;background-color: #5286FF;border:none;margin-bottom: 12px;">
        <div v-if="isSearchVisible" class="search" ref="search">
            <el-row :gutter="20" class="search-row">
                <el-col :span="8">
                    <div class="grid-content search-grid-content">
                        <label class="search-label">姓名：</label>
                        <el-input class="search_input" v-model="search.name" placeholder="请输入姓名"></el-input>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content search-grid-content">
                        <label class="search-label">工号：</label>
                        <el-input class="search_input" v-model="search.no" placeholder="请输入工号">
                        </el-input>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content search-grid-content">
                        <label class="search-label">手机号：</label>
                        <el-input class="search_input" v-model="search.mobile" placeholder="请输入手机号">
                        </el-input>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="search-row">
                <el-col :span="8">
                    <div class="grid-content search-grid-content">
                        <label class="search-label">所属组织：</label>
                        <el-input class="search_input" v-model="search.orgName" placeholder="请输入所属组织"></el-input>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content search-grid-content">
                        <label class="search-label">人员状态：</label>
                        <el-select class="search_input el-input" v-model="search.status" placeholder="请选择人员状态"
                                   clearable>
                            <el-option
                                    v-for="item in statusList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                </el-col>
            </el-row>
            <el-button type="primary" class="search-btn-primary" @click="searchList" icon="el-icon-search">搜索
            </el-button>
        </div>


        <div class="option-menu">
            <el-button type="primary" class="add-btn" @click="addOrUpdateEmployee()" icon="el-icon-plus"
                       v-acl="['employee:add']">新增人员
            </el-button>
            <el-button v-acl="['employee:view']" type="primary" class="search-btn"
                       @click="toggleSearch"
                       icon="el-icon-search"
                       style="float: right;"/>
        </div>
        <div>
            <el-table
                    :data="tableData"
                    stripe
                    border
                    style="width: 100%"
                    max-height="maxHeight"
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
                        prop="name"
                        label="姓名"
                        align="center"
                        :show-overflow-tooltip='true'>
                </el-table-column>

                <el-table-column
                        prop="no"
                        label="工号"
                        align="center"
                        :show-overflow-tooltip='true'>
                </el-table-column>

                <el-table-column
                        prop="mobile"
                        label="手机号"
                        align="center"
                        :show-overflow-tooltip='true'>
                </el-table-column>

                <el-table-column
                        prop="originationName"
                        label="所属组织"
                        align="center"
                        :show-overflow-tooltip='true'>
                </el-table-column>

                <el-table-column
                        prop="createTime"
                        label="创建时间"
                        align="center"
                        :show-overflow-tooltip='true'>
                </el-table-column>

                <el-table-column
                        prop="status"
                        label="人员状态"
                        align="center"
                        :show-overflow-tooltip='true'>
                </el-table-column>

                <el-table-column
                        prop="operation"
                        label="操作"
                        align="center"
                        width="180">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status === '在职' && scope.row.canEdit" type="text" size="small"
                                   v-acl="['employee:update']"
                                   @click="addOrUpdateEmployee(scope.row.id)">修改
                        </el-button>

                        <el-button v-acl="['employee:view']" @click="getEmployee(scope.row.id)" type="text"
                                   v-if="scope.row.canEdit"
                                   size="small">查看
                        </el-button>
                        <el-button v-if="scope.row.status === '在职'  && scope.row.canEdit" type="text" size="small"
                                   class="delete-btn"
                                   v-acl="['icCard:deleted']"
                                   @click="deletedEmployee(scope.row.id)">
                            销户
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

        <!--        新增编辑弹窗-->
        <editdialog v-if="isVisible" ref="addOrUpdate"/>

        <!--        查看弹窗-->
        <el-dialog class="dialog"
                   title="查看人员"
                   :close-on-click-modal="false"
                   :visible.sync="isShowVisible" width="40%">
            <el-form ref="form1" :model="form1" disabled label-width="100px" label-position="right">

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

                <el-form-item prop="cardNo" label="卡号">
                    <el-input type="number" v-model.trim="form1.cardNo" auto-complete="off" placeholder="卡号">
                    </el-input>
                </el-form-item>

                <el-form-item prop="validityTime" label="卡有效期">
                    <el-date-picker
                            v-model="form1.validityTime"
                            type="date"
                            placeholder="请选择卡有效期">
                    </el-date-picker>
                </el-form-item>

                <el-form-item prop="openCardAmount" label="开卡存入金额">
                    <el-input type="number" v-model.trim="form1.openCardAmount" auto-complete="off"
                              placeholder="请输入开卡存入金额"/>
                </el-form-item>

                <el-form-item prop="originationName" label="所属组织">
                    <el-input type="text" v-model.trim="form1.originationName" auto-complete="off"
                              placeholder="请选择组织"/>
                </el-form-item>

                <el-form-item label="角色" prop="roles">
                    <el-select class="select_normal" v-model="form1.roles" multiple placeholder="请选择角色">
                        <el-option
                                v-for="item in roleList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

            </el-form>

            <el-button type="primary" class="dialog-btn-normal" @click="isShowVisible = false" :disabled="false">关 闭
            </el-button>

        </el-dialog>

    </div>
</template>
<script>
    import {deleted, get, list} from '@/api/employeeList';
    import EditDialog from '@/components/EditDialog';
    import {listAllRole} from '@/api/role';

    export default {
        inject: ['reload'],
        components: {
            editdialog: EditDialog
        },
        data() {
            return {
                currentPage: 1,
                total: 1,
                tableName: '',
                tableData: [],
                maxHeight: 1000,
                search: {
                    orgName: "",
                    name: "",
                    no: "",
                    mobile: '',
                    cardNo: '',
                    createStart: '',
                    createEnd: '',
                    cardTimeStart: '',
                    cardTimeEnd: '',
                    status: '',
                    page: 1,
                    size: 10
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
                    cardId: '',
                    cardNo: '',
                    roles: [],
                    type: '',
                    minimumBalance: '',
                    validityTime: '',
                    openCardAmount: '',
                    deposit: '',
                    expense: ''
                },
                roleList: [],
                cardTypeList: [
                    {id: 1, name: 1},
                    {id: 2, name: 2}
                ],
                statusList: [
                    {id: '', name: '全部'},
                    {id: 1, name: '正常'},
                    {id: 2, name: '离职'}
                ],
                isVisible: false, //编辑新增弹窗
                isShowVisible: false,//查看弹窗
                isSearchVisible: false, //搜索
            }
        },
        mounted: function () {
            this.maxHeight = this.$ViewportSize - 260
            let setSearch = JSON.parse(localStorage.getItem('search'))
            if (setSearch !== 'null' && setSearch != null) {
                this.search = setSearch
                this.getList();
            } else {
                localStorage.setItem('search', JSON.stringify(this.search))
                this.getList();
            }
        },

        created() {
            window.addEventListener('beforeunload', e => this.beforeunloadFn(e))
        },

        methods: {
            async getList() { //获取数据
                let res = await list(this.search);
                if (res.code === 1000) {
                    this.total = res.data.total;
                    this.currentPage = res.data.currentPage;
                    this.tableData = res.data.data
                }

                // 新增修改触发方法
            },
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
                this.getEmployeeRole()
                this.$nextTick(() => {
                    this.showEmployee()
                })
            },

            async showEmployee() { //获取员工数据
                let res = await get(this.form1.id);
                if (res.code === 1000) {
                    this.form1 = res.data
                }
            },

            //点击销户按钮
            deletedEmployee(id) {
                this.$confirm('确定销户？该操作不可撤销', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleted(id)
                }).catch(() => {

                });
            },

            //销户
            async deleted(id) {
                let res = await deleted(id)

                if (res.code === 1000) {
                    this.reload()
                }
            },

            //获取角色列表
            async getEmployeeRole() {
                let res = await listAllRole()
                if (res.code === 1000) {
                    this.roleList = res.data
                }
            },

            searchList() {
                this.search.page = 1
                this.getList()

                localStorage.setItem('search', JSON.stringify(this.search))
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

            toggleSearch() {
                this.isSearchVisible = !this.isSearchVisible
                if (this.isSearchVisible === true) {
                    this.$nextTick(() => {
                        let height = this.$refs.search.offsetHeight;
                        this.maxHeight = this.$ViewportSize - 300 - height + 1
                    })
                } else {
                    this.maxHeight = this.$ViewportSize - 300
                }
            },


        },
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
