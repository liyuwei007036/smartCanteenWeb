<template>
    <div>
        <div style="background-color: #fff;padding: 15px;margin-bottom: 15px;">
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

            <div id="chartColumn1" style="height: 300px;">
            </div>
        </div>
        <div style="background-color: #fff;padding: 25px;margin-bottom: 0px">
            <div id="chartColumn" style="height: 350px;">
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
                        color: ['#2FC25B'],
                        title: {
                            text: '消费峰值统计',
                            left: '10%',
                            textStyle: {
                                fontStyle: 'normal',
                                fontSize: 14,
                                fontWeight: 'bolder',
                                color: '#000'
                            }
                        },
                        legend: {
                            type: 'plain',
                            show: true,
                            data: ['支付笔数'],
                            right: '10%',
                            selectedMode: false,
                            icon: 'circle',
                            itemHeight: 10,
                            itemWidth: 10,

                        },
                        tooltip: {},
                        minInterval: 1,
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            axisLabel: {
                                margin: 20,
                            },
                            data: this.lineChatX,
                        },
                        yAxis: {
                            min: 0,
                            type: 'value',
                            show: true,
                            axisTick: {
                                show: false
                            },
                            axisLabel: {
                                margin: 20,
                            },
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    color: {
                                        type: 'radial',
                                        x: 0.5,
                                        y: 0.5,
                                        r: 0.5,
                                        colorStops: [{
                                            offset: 0, color: '#fff' // 0% 处的颜色
                                        }, {
                                            offset: 1, color: '#fff' // 100% 处的颜色
                                        }],
                                        global: false // 缺省为 false
                                    }
                                }
                            },
                            splitLine: {
                                lineStyle: {
                                    color: ['#aaa'],
                                    type: 'dashed'
                                }
                            }
                        },
                        series: [{
                            symbol: 'circle',
                            name: '支付笔数',
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