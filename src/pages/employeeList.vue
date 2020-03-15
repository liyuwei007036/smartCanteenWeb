<template>
    <div>
        <keep-alive>
            <div v-if="isSerachVisible" class="search" style="border-bottom: 1px solid #eaeaea;padding-bottom: 15px">
                <div class="search-group" style="padding: 5px 0;display: flex;flex: 1">
                    <el-input class="search_input" v-model="search.name" placeholder="请输入姓名">
                        <template slot="prepend">姓名</template>
                    </el-input>
                    <el-input class="search_input" v-model="search.orgName" placeholder="请输入所属组织">
                        <template slot="prepend">所属组织</template>
                    </el-input>
                    <el-input class="search_input" v-model="search.no" placeholder="请输入账号">
                        <template slot="prepend">账号</template>
                    </el-input>
                    <el-input class="search_input" v-model="search.cardNo" placeholder="请输入卡号">
                        <template slot="prepend">卡号</template>
                    </el-input>
                </div>
                <div class="search-group" style="padding: 5px 0;display: flex;flex: 1">
                    <el-date-picker class="search_input"
                                    v-model="search.createStart"
                                    type="date"
                                    placeholder="创建开始时间" clearable>
                    </el-date-picker>

                    <el-date-picker class="search_input"
                                    v-model="search.createEnd"
                                    type="date"
                                    placeholder="创建结束时间" clearable>
                    </el-date-picker>
                    <el-date-picker class="search_input"
                                    v-model="search.cardTimeStart"
                                    type="date"
                                    placeholder="卡有效期开始时间" clearable>
                    </el-date-picker>

                    <el-date-picker class="search_input"
                                    v-model="search.cardTimeEnd"
                                    type="date"
                                    placeholder="卡有效期结束时间" clearable>
                    </el-date-picker>
                </div>
                <el-button type="primary" @click="searchList" icon="el-icon-search">搜索</el-button>
            </div>
        </keep-alive>
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
                    max-height="550">
                <el-table-column
                        type="index"
                        label="序号"
                        align="center"
                        className="table-column-width">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="姓名"
                        align="center"
                        :show-overflow-tooltip='true'>
                </el-table-column>

                <el-table-column
                        prop="no"
                        label="账号"
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
                        prop="cardNo"
                        label="卡号"
                        align="center"
                        :show-overflow-tooltip='true'>
                </el-table-column>

                <el-table-column
                        prop="type"
                        label="卡类型"
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
                        prop="status"
                        label="状态"
                        align="center"
                        :show-overflow-tooltip='true'>
                </el-table-column>

                <el-table-column
                        prop="validityTime"
                        label="卡有效期"
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
                        prop="operation"
                        label="操作"
                        align="center"
                        width="180">
                    <template slot-scope="scope">
                        <el-button v-acl="['employee:view']" @click="getEmployee(scope.row.id)" type="text"
                                   size="small">查看
                        </el-button>
                        <el-button v-if="scope.row.status === '在职'" type="text" size="small" v-acl="['employee:update']"
                                   @click="addOrUpdateEmployee(scope.row.id)">编辑
                        </el-button>
                        <el-button v-if="scope.row.status === '在职'" type="text" size="small" class="delete-btn"
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
        <el-dialog
                title="查看"
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

                <el-form-item prop="password" label="卡密码">
                    <el-input type="password" v-model.trim="form1.password" auto-complete="off"
                              placeholder="密码"></el-input>
                </el-form-item>

                <el-form-item prop="minimumBalance" label="卡最低余额">
                    <el-input type="number" v-model.trim="form1.minimumBalance" auto-complete="off"
                              placeholder="请输入卡最低余额"></el-input>
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

                <el-form-item prop="deposit" label="押金">
                    <el-input type="number" v-model.trim="form1.deposit" auto-complete="off"
                              placeholder="请输入押金"/>
                </el-form-item>


                <el-form-item prop="expense" label="工本费">
                    <el-input type="number" v-model.trim="form1.expense" auto-complete="off"
                              placeholder="请输入工本费"/>
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

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="isShowVisible = false">关 闭</el-button>
            </span>

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
                isVisible: false, //编辑新增弹窗
                isShowVisible: false,//查看弹窗
                isSerachVisible: false, //搜索
            }
        },
        mounted: function () {
            let setSearch = JSON.parse(localStorage.getItem('search'))
            console.log(setSearch)
            if (setSearch != 'null' && setSearch != null) {
                this.search = setSearch
                console.log(111)
                this.getList();
            } else {
                console.log(222)
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
                console.log(this.search)
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
                this.getEmployeeRole()
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

            //点击销户按钮
            deletedEmployee(id) {
                this.$confirm('确定销户？该操作不可撤销', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleted(id)
                }).catch(() => {
                    console.log('取消销户')
                });
            },

            //销户
            async deleted(id) {
                let res = await deleted(id)
                console.log(res)
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
                console.log(this.search)
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
                this.isSerachVisible = !this.isSerachVisible
            }

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

    .table-column-width {
        width: 9% !important;
    }
</style>
