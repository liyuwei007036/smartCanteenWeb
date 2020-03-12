<template>
    <div>
        <div class="search"
             style="background: #fff;padding: 15px;border-radius: 6px;;box-shadow: 0 0 6px 0 #DFDFDF;">
            <div class="content-header"
                 style="border-bottom: 1px solid #f2f2f2;padding-bottom: 15px">
                查询条件
            </div>
            <el-form ref="form" :model="form" label-width="140px" style="padding-top:  15px">
                <el-form-item label="授权角色对象：">
                    <el-select v-model="roleId" placeholder="请选择角色" @change="getRolePermissions">
                        <el-option
                                v-for="item in roleList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>

        <div class="search"
             style="background: #fff;padding: 15px;border-radius: 6px;;box-shadow: 0 0 6px 0 #DFDFDF;">
            <div class="content-header"
                 style="border-bottom: 1px solid #f2f2f2;padding-bottom: 15px">
                权限分类
            </div>
            <div>
                <el-tree
                        :data="permissions"
                        :show-checkbox="true"
                        default-expand-all
                        node-key="code"
                        :default-checked-keys="checked"
                        ref="tree"
                        highlight-current
                        :props="defaultProps">
                </el-tree>
            </div>

            <div>
                <div class="buttons">
                    <el-button @click="getCheckedKeys">保存</el-button>
                </div>
            </div>
        </div>


    </div>
</template>

<script>
    import {listAllRole} from '@/api/role';
    import {addPermission, getRolePermission, permission} from '@/api/permission'

    export default {
        name: "roleAuth",
        data() {
            return {
                form: {
                    id: '',
                    name: ''
                },
                checked: [],
                roleId: '',
                roleList: [],
                permissions: [],
                defaultProps: {
                    children: 'children',
                    label: 'name',
                }
            }
        },
        mounted: function () {
            this.getListAll();
            this.listPermission();
        },

        methods: {
            async getCheckedKeys() {
                let data = {
                    permissions: this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys()),
                    id: this.roleId
                }
                if(parseInt(this.roleId) < 1){
                    this.$message.error('请选择角色')
                    return
                }
                let res = await addPermission(data)
                if (res.code === 1000) {
                    this.$message.success('操作成功')
                } else {
                    this.$message.error(res.msg);
                }
            },
            async listPermission() {
                let res = await permission();
                if (res.code === 1000) {
                    this.permissions = res.data
                }
            },
            async getRolePermissions() {
                sessionStorage.setItem("x-permisson_id", this.roleId)
                this.$refs.tree.setCheckedKeys([]);
                let res = await getRolePermission(this.roleId)
                this.checked = res.data || []
            },
            //获取列表数据
            async getListAll() {
                let res = await listAllRole();
                if (res.code === 1000) {
                    res.data.forEach(el => {
                        this.roleList.push({name: el.name, id: el.id});
                    })
                    this.roleId = parseInt(sessionStorage.getItem("x-permisson_id")) || null
                    if (this.roleId) {
                        this.getRolePermissions()
                    }
                } else {
                    this.$message.error(res.msg);
                }
            },
        }
    }
</script>
