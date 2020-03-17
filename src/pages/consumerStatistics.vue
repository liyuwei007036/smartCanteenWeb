<template>
    <div>
        <div style="background-color: #fff;padding: 15px">
            <div style="display: flex;align-items: center;justify-content: left;border-bottom: 1px solid #eee">
                <div style="font-size: 18px;height: 40px;line-height: 40px;padding: 0 20px;border-bottom:1px solid #108DE9">
                    销售额
                </div>
                <el-tabs>
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
    import {lineChat} from "../api/dateSummary";

    export default {
        name: "dataStatistics",
        data() {
            return {
                chartColumn: null,
                lineChatX: [],
                lineChatY: [],
            }
        },
        mounted() {
            this.drawLine();
        },
        methods: {
            drawLine() {
                this.chartColumn = echarts.init(document.getElementById('chartColumn'));
                this.getLineChatData()

            },
            async getLineChatData() {
                let res = await lineChat()
                if (res && res.code === 1000) {
                    let data = res.data
                    for (let x in data) {
                        this.lineChatX.push(x)
                        this.lineChatY.push(data[x])
                    }
                    this.chartColumn.setOption({
                        title: {
                            text: '消费峰值统计',
                            textStyle: {
                                fontStyle: 'normal',
                                fontSize: 14,
                                color: '#000'
                            }
                        },
                        tooltip: {},
                        xAxis: {
                            type: 'category',
                            data: this.lineChatX,
                        },
                        yAxis: {
                            type: 'value',
                            show: true,
                            axisLine: {
                                show: true
                            }
                        },
                        series: [{
                            data: this.lineChatY,
                            type: 'line'
                        }]
                    });
                    console.log(this.lineChatX, this.lineChatY)
                }
            }
        }
    }
</script>

<style scoped>
    /deep/ .el-tabs__header {
        margin: 0;
    }
</style>