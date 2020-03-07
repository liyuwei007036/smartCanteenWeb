<template>
    <div>
        <div class="search"
             style="background: #fff;padding: 15px;border-top-left: 6px;border-top-right-radius: 6px;box-shadow: 0 0 6px 0 #DFDFDF;">
            <div class="content-header"
                 style="border-bottom: 1px solid #f2f2f2;padding-bottom: 15px">
                查询条件
            </div>
            <el-form ref="form" :model="form" label-width="140px" style="padding-top:  15px">
                <el-form-item label="授权角色对象：">
                    <el-select v-model="value" placeholder="请选择角色">
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
    </div>
</template>

<script>
    import {listAll} from '@/api/role';

    export default {
        name: "roleAuth",
        data() {
            return {
                form: {
                    id: '',
                    name: ''
                },
                value: '',
                roleList: []

            }
        },
        mounted: function () {
            this.getListAll();
        },

        methods: {
            //获取列表数据
            async getListAll() {
                let res = await listAll();
                console.log(res)
                if (res.code === 1000) {

                    res.data.forEach(el => {
                        console.log(el)
                        this.roleList.push({name: el.name, id: el.id});
                    })

                } else {
                    this.$message.error(res.msg);
                }
            },
        }
    }
</script>

<style>

</style>