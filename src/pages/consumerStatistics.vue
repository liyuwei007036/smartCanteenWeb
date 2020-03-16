<template>
    <div>
        <div style="background-color: #fff;padding: 15px">
            <div style="display: flex;align-items: center;justify-content: left;border-bottom: 1px solid #eee">
                <div style="font-size: 18px;height: 40px;line-height: 40px;padding: 0 20px;border-bottom:1px solid #108DE9">
                    销售额
                </div>
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="今日" name="first" style="margin:0;">今日</el-tab-pane>
                    <el-tab-pane label="本周" name="second" style="margin:0;">本周</el-tab-pane>
                    <el-tab-pane label="本月" name="third" style="margin:0;">本月</el-tab-pane>
                    <el-tab-pane label="本年" name="fourth" style="margin:0;">本年</el-tab-pane>
                </el-tabs>
            </div>
            <div id="chartColumn" style="height: 400px;">
            </div>
        </div>
    </div>
</template>

<script>
    import echarts from 'echarts'

    export default {
        name: "dataStatistics",
        data() {
            return {
                chartColumn: null
            }
        },
        mounted() {
            this.drawLine();
        },
        methods: {
            drawLine() {
                this.chartColumn = echarts.init(document.getElementById('chartColumn'));

                this.chartColumn.setOption({
                    tooltip: {},
                    xAxis: {
                        type: 'category',
                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: [820, 932, 901, 934, 1290, 1330, 1320],
                        type: 'line'
                    }]
                });
            }
        }
    }
</script>

<style scoped>
    /deep/ .el-tabs__header {
        margin: 0;
    }
</style>