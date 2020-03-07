<template>
    <div>

        <div v-if="isSearchVisible" class="search" style="border-bottom: 1px solid #eaeaea;padding-bottom: 15px">
            <el-button type="primary" @click="serach" icon="el-icon-search">搜索</el-button>
        </div>

        <div class="option-menu">
            <el-button type="primary" class="search-btn" @click="isSearchVisible = !isSearchVisible"
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
                        align="center">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="姓名"
                        align="center"
                        width="">
                </el-table-column>
                <el-table-column
                        prop="no"
                        label="编号"
                        align="center"
                        width="">
                </el-table-column>
                <el-table-column
                        prop="no"
                        label="卡号"
                        align="center"
                        width="">
                </el-table-column>
                <el-table-column
                        prop="no"
                        label="所属组织"
                        align="center"
                        width="">
                </el-table-column>
                <el-table-column
                        prop="no"
                        label="是否发卡"
                        align="center"
                        width="">
                </el-table-column>
                <el-table-column
                        prop="no"
                        label="卡类别"
                        align="center"
                        width="">
                </el-table-column>
                <el-table-column
                        prop="no"
                        label="卡状态"
                        align="center"
                        width="">
                </el-table-column>
                <el-table-column
                        prop="no"
                        label="账户状态"
                        align="center"
                        width="">
                </el-table-column>
                <el-table-column
                        prop="no"
                        label="受理时间"
                        align="center"
                        width="">
                </el-table-column>
                <el-table-column
                        prop="operation"
                        label="操作"
                        align="center"
                        fixed="right"
                        width="">
                    <template slot-scope="scope">
                        <el-button type="text" size="small"
                                   @click="addOrUpdateRole(scope.row.id)">挂失
                        </el-button>
                        <el-button type="text" size="small"
                                   @click="deleteUser(scope.row.id)">补办
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
                    :page-sizes="[50, 75, 100]"
                    :page-size="1"
                    hide-on-single-page
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        name: "patchCard",
        inject: ['reload'],
        data() {
            return {
                isSearchVisible: false,
                currentPage: 1,
                total: 1,
                tableData: [{}],
            }
        },
        methods: {
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

<style scoped>

</style>