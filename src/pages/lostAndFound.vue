<template>
    <div>
        <hr style="height: 2px;background-color: #5286FF;border:none;margin-bottom: 12px;">


        <div v-if="isSearchVisible" class="search" ref="search">

            <el-row :gutter="20" class="search-row">
                <el-col :span="8">
                    <div class="grid-content search-grid-content">
                        <label class="search-label">姓名：</label>
                        <el-input class="search_input" v-model="search.empName" placeholder="请输入姓名"></el-input>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content search-grid-content">
                        <label class="search-label">工号：</label>
                        <el-input class="search_input" v-model="search.empNo" placeholder="请输入工号"></el-input>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content search-grid-content">
                        <label class="search-label">手机号：</label>
                        <el-input class="search_input" v-model="search.mobile" placeholder="请输入手机号"></el-input>
                    </div>
                </el-col>
            </el-row>

            <el-row :gutter="20" class="search-row">
                <el-col :span="8">
                    <div class="grid-content search-grid-content">
                        <label class="search-label">卡号：</label>
                        <el-input class="search_input" v-model="search.cardNo" placeholder="请输入卡号"></el-input>
                    </div>
                </el-col>

                <el-col :span="8">
                    <div class="grid-content search-grid-content">
                        <label class="search-label">卡状态：</label>
                        <el-select class="search_input el-input" v-model="search.cardStatus" placeholder="请选择卡状态"
                                   clearable>
                            <el-option
                                    v-for="item in carStatusList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                </el-col>

                <el-col :span="8">
                    <div class="grid-content search-grid-content">
                        <label class="search-label">账户状态：</label>
                        <el-select class="search_input el-input" v-model="search.accountStatus" placeholder="请选择账户状态"
                                   clearable>
                            <el-option
                                    v-for="item in accountStatusList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                </el-col>
            </el-row>

            <el-button type="primary" class="search-btn-primary" @click="serach" icon="el-icon-search"
                       v-acl="['icCard:list']">搜索
            </el-button>
        </div>

        <div class="option-menu clearfix">
            <el-button type="primary" class="search-btn" @click="toggleSearch"
                       icon="el-icon-search"
                       style="float: right;"></el-button>
        </div>

        <div>
            <el-table
                    :data="tableData"
                    stripe
                    border
                    style="width: 100%"
                    :max-height="maxHeight"
                    @selection-change="handleSelectionChange"
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
                        :show-overflow-tooltip='true'>
                </el-table-column>
                <el-table-column
                        prop="empNo"
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
                        prop="cardNo"
                        label="卡号"
                        align="center"
                        :show-overflow-tooltip='true'>
                </el-table-column>
                <el-table-column
                        prop="status"
                        label="卡状态"
                        align="center"
                        :show-overflow-tooltip='true'>
                </el-table-column>
                <el-table-column
                        prop="accountStatus"
                        label="账户状态"
                        align="center"
                        :show-overflow-tooltip='true'>
                </el-table-column>
                <el-table-column
                        prop="currentBalance"
                        label="余额(元)"
                        align="center"
                        :show-overflow-tooltip='true'>
                </el-table-column>
                <el-table-column
                        prop="operation"
                        label="操作"
                        align="center"
                        width="180">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" :disabled="scope.row.accountStatus !== '挂失'"
                                   class="green-btn"
                                   v-acl="['icCard:patch']"
                                   @click="replaceAccounnt(scope.row.id)">补卡
                        </el-button>
                        <el-button type="text" size="small" class="delete-btn" :disabled="scope.row.status !== '激活'"
                                   v-acl="['icCard:loss']"
                                   @click="lossAccounnt(scope.row.id)">挂失
                        </el-button>
                        <el-button type="text" size="small" class="delete-btn"
                                   :disabled="scope.row.accountStatus !== '挂失'"
                                   v-acl="['icCard:unloss']"
                                   @click="unLossAccount(scope.row.id)">解挂
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

        <!--        补卡弹窗-->

        <el-dialog class="dialog"
                   title="补卡"
                   :close-on-click-modal="false"
                   :visible.sync="isReplaceVisible"
                   width="40%"
                   @closed="handleClose">
            <el-form ref="replaceForm" :model="replaceForm" :rules="replaceRules" status-icon label-width="100px"
                     label-position="right">
                <el-form-item prop="name" label="姓名">
                    <el-input type="text" v-model.trim="replaceForm.empName" auto-complete="off"
                              placeholder="姓名" disabled></el-input>
                </el-form-item>
                <el-form-item prop="no" label="工号">
                    <el-input type="text" v-model.trim="replaceForm.empNo" auto-complete="off" placeholder="工号"
                              disabled></el-input>
                </el-form-item>

                <el-form-item prop="password" label="登录密码">
                    <el-input type="password" v-model.trim="replaceForm.password" auto-complete="off"
                              placeholder="登录密码" disabled/>
                </el-form-item>

                <el-form-item prop="confirmPassword" label="确认密码">
                    <el-input type="password" v-model.trim="replaceForm.confirmPassword" auto-complete="off"
                              placeholder="确认密码" disabled/>
                </el-form-item>

                <el-form-item prop="idCard" label="身份证号">
                    <el-input type="text" v-model.trim="replaceForm.idCard" auto-complete="off" placeholder="身份证号"
                              disabled></el-input>
                </el-form-item>


                <el-form-item prop="mobile" label="手机号">
                    <el-input type="mobile" v-model.trim="replaceForm.mobile" auto-complete="off"
                              placeholder="手机号" disabled></el-input>
                </el-form-item>

                <el-form-item prop="cardNo" label="卡号" class="getCard">
                    <el-input type="number" v-model.trim="replaceForm.cardNo" auto-complete="off" placeholder="卡号"
                              @mousewheel.native.prevent>
                    </el-input>
                    <el-button @click="readCard()"
                               style="margin-left: 10px;height: 34px;color: #fff;background-color: #2E6CFE;font-size: 13px;line-height: 34px;padding:0 10px;border: none">
                        点击读卡
                    </el-button>
                </el-form-item>

                <el-form-item prop="validityTime" label="卡有效期">
                    <el-date-picker
                            v-model="replaceForm.validityTime"
                            type="date"
                            placeholder="请选择卡有效期"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            disabled>
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="角色" prop="roles">
                    <el-select class="select_normal" v-model="replaceForm.roleName" multiple placeholder="请选择角色"
                               disabled>
                    </el-select>
                </el-form-item>

                <el-form-item prop="orgName" label="所属组织">

                    <el-input type="text" v-model.trim="replaceForm.orgName" auto-complete="off"
                              placeholder="所属组织" disabled/>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button class="dialog-btn-reset" @click="resetReplaceForm('replaceForm')">重 置</el-button>
                    <el-button type="primary" class="dialog-btn-normal" @click="handleSubmit('replaceForm')">保存
                    </el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {list, loss, patch, getPatchUser, unLoss} from '@/api/card';


    export default {
        name: "lostAndFound",
        inject: ['reload'],
        data() {
            return {
                isSearchVisible: false,
                isReplaceVisible: false,
                isShow: true,
                currentPage: 1,
                total: 1,
                tableData: [],
                name: '',
                no: '',
                currentBalance: '',
                maxHeight: 1000,
                search: {
                    accountStatus: "",
                    cardNo: "",
                    cardStatus: "",
                    empName: "",
                    empNo: "",
                    start: "",
                    end: "",
                    mobile: "",
                    page: 1,
                    size: 10,
                },
                carStatusList: [{
                    name: '请选择',
                    id: ''
                }, {
                    name: '激活',
                    id: '1'
                }, {
                    name: '禁止',
                    id: '2'
                }],
                accountStatusList: [{
                    name: '请选择',
                    id: ''
                }, {
                    name: '正常',
                    id: '1'
                }, {
                    name: '挂失',
                    id: '2'
                }, {
                    name: '解挂',
                    id: '3'
                }, {
                    name: '已退卡',
                    id: '4'
                }, {
                    name: '已补卡',
                    id: '5'
                }],
                replaceForm: {
                    id: '',
                    name: '',
                    no: '',
                    idCard: '',
                    mobile: '',
                    password: '',
                    confirmPassword: '',
                    orgName: "",
                    cardId: '',
                    cardNo: '',
                    type: '1',
                    validityTime: '',
                    roleName: []

                },
                replaceRules: {
                    cardNo: [{required: true, message: '必须填写卡号', trigger: 'blur'}],
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

            //获取列表数据
            async getList() {
                let res = await list(this.search);
                console.log(res)
                if (res.code === 1000) {
                    this.total = res.data.total;
                    this.currentPage = res.data.currentPage;
                    this.tableData = res.data.data
                } else {

                }
            },

            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            //点击挂失按钮
            lossAccounnt(id) {
                this.$confirm('确定挂失该卡片？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.loss(id)
                }).catch(() => {
                    console.log('取消挂失')
                });
            },

            unLossAccount(id) {
                this.$confirm('确定解挂该卡片？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.unLoss(id)
                }).catch(() => {
                    console.log('取消挂失')
                });
            },


            //挂失
            async loss(id) {
                let res = await loss(id)
                console.log(res)
                if (res.code === 1000) {
                    this.$message.success('挂失成功');
                    this.getList()
                }
            },
            //挂失
            async unLoss(id) {
                let res = await unLoss(id)
                console.log(res)
                if (res.code === 1000) {
                    this.$message.success('解挂成功');
                    this.getList()
                }
            },

            //补卡
            replaceAccounnt(id) {
                this.isReplaceVisible = true
                this.replaceForm = {};
                this.$nextTick(() => {
                    this.getUser(id)
                })
            },

            //获取用户数据
            async getUser(id) {
                let res = await getPatchUser(id);
                console.log(res)
                if (res.code === 1000) {
                    this.replaceForm = res.data
                    console.log(this.replaceForm)
                } else {

                }
            },

            //读卡
            readCard() {
                let that = this
                if (that.socket.ws && that.socket.ws.readyState === 1) {
                    that.socket.ws.send(JSON.stringify({
                        start: true,
                        type: 'readCard',
                        token: sessionStorage.getItem('x-smart-token')
                    }))
                    this.$message.success('正在读卡中');
                    that.socket.ws.onmessage = this.getMessage
                }
            },
            getMessage(e) {
                console.log(e.data)
                this.replaceForm.cardNo = e.data
                this.$forceUpdate();
            },

            handleSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.patchForm();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            },

            async patchForm() {
                let res = await patch(this.replaceForm)
                console.log(res)
                if (res.code === 1000) {
                    this.$message.success('补卡成功');
                    this.visible = false;
                    this.reload()
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

            handleClose() {
                let that = this
                if (that.socket.ws && that.socket.ws.readyState === 1) {
                    let token = sessionStorage.getItem('x-smart-token') || 'x';
                    that.socket.ws.send(JSON.stringify({
                        start: false,
                        type: 'readCard',
                        token: token
                    }))
                }
                try {
                    this.$refs['replaceForm'].resetFields()
                } catch (e) {

                }
                try {
                    this.$refs['form'].resetFields()
                } catch (e) {

                }
                try {
                    this.$refs['deductionForm'].resetFields()
                } catch (e) {

                }
            },

            resetForm(formName) {
                this.$refs[formName].resetFields();
            },

            resetReplaceForm() {
                this.replaceForm.cardNo = ''
            },

            toggleSearch() {
                this.isSearchVisible = !this.isSearchVisible
                if (this.isSearchVisible === true) {
                    this.$nextTick(() => {
                        let height = this.$refs.search.offsetHeight;
                        // console.log(height)
                        this.maxHeight = this.$ViewportSize - 300 - height + 1
                        console.log(this.maxHeight)
                    })
                } else {
                    this.maxHeight = this.$ViewportSize - 300
                    console.log(this.maxHeight)
                }
            }

        }
    }
</script>

<style scoped>
    .select_normal /deep/ input[readonly] {
        background-color: #fff;
    }

    .select_normal /deep/ input[disabled] {
        background-color: #f1f1f5;
    }


    .getCard /deep/ .el-form-item__content {
        display: flex;
        justify-content: center;
        align-items: center;
    }


    /deep/ .el-dialog {
        display: flex;
        flex-direction: column;
        margin: 0 !important;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        /*height:600px;*/
        max-height: calc(100% - 30px);
        max-width: calc(100% - 30px);
    }

    /deep/ .el-dialog .el-dialog__body {
        flex: 1;
        overflow: auto;
    }
</style>