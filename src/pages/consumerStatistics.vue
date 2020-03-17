<template>
    <div class="statistics">
        <div style="background-color: #fff;padding: 15px;margin-bottom: 15px;">
            <div style="border-bottom: 1px solid #E8E8E8;height: 30px">
                <div style="font-size: 16px;border-bottom: 2px solid #108DE9;height: 30px;display:inline-block;line-height: 30px;padding: 0 15px;color: #1890FF">
                    销售额
                </div>
                <div style="display: inline-block;margin-left: 20px;color: #666666;font-size: 14px;">
                    <span :class="{is_active:actives === 'day','statistics-tab':true}" style="padding: 0 10px"
                          @click="click('day')">今日</span>
                    <span :class="{is_active:actives === 'week','statistics-tab':true}" style="padding: 0 10px"
                          @click="click('week')">本周</span>
                    <span :class="{is_active:actives === 'month','statistics-tab':true}" style="padding: 0 10px"
                          @click="click('month')">本月</span>
                    <span :class="{is_active:actives === 'year','statistics-tab':true}" style="padding: 0 10px"
                          @click="click('year')">全年</span>

                </div>
            </div>
            <div style="display: flex;align-items: center;padding: 25px 0">
                <div v-if='actives == "day"' id="chartColumn1" style="height: 350px;width: 70%">

                </div>
                <div v-if='actives == "week"' id="chartColumn2" style="height: 350px;width: 70%">

                </div>
                <div v-if='actives == "month"' id="chartColumn3" style="height: 350px;width: 70%">

                </div>
                <div v-if='actives == "year"' id="chartColumn" style="height: 350px;width: 70%">

                </div>
                <div style="border: 1px solid #108DE9;width: 30%;height: 280px;">

                </div>
            </div>
        </div>

        <div style="background-color: #fff;padding: 25px;margin-bottom: 0px">
            <!--            <div id="chartColumn" style="height: 350px;">-->
            <!--            </div>-->
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
                isDayChart: false,
                isWeekChart: false,
                isMonthChart: false,
                isYearChart: true,
                actives: 'year',
                is_show: 'year'

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
                            // text: '消费峰值统计',
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
                            data: [{
                                icon: 'circle',
                                name: '支付笔数',
                            }],
                            right: '10%',
                            top: '5%',
                            selectedMode: false,
                            itemHeight: 8,
                            itemWidth: 8,

                        },
                        tooltip: {
                            trigger: 'axis',
                            backgroundColor: 'rgba(50,50,50,0.9)',
                            padding: [
                                15,  // 上
                                10, // 右
                                15,  // 下
                                10, // 左
                            ],
                            formatter: function (params) {
                                return params[0].axisValueLabel + '</br>' + params[0].marker + ' ' + params[0].seriesName + ': ' + params[0].value + '笔'
                            }
                        },
                        minInterval: 1,
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            axisLabel: {
                                margin: 20,
                                formatter: function (value, index) {
                                    // 格式化成月/日，只在第一个刻度显示年份
                                    return new Date(value).format("hh:mm");
                                }
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
            },

            click(i) {
                console.log(i)
                this.actives = i
                console.log(this.actives == i)
            }
        }
    }
</script>

<style scoped>
    /deep/ .el-tabs__header {
        margin: 0;
    }

    .statistics.statistics-tab {
        padding: 0 10px;
    }

    .statistics-tab:hover, .statistics-tab:focus {
        color: #9760E4;
        cursor: pointer;
    }

    .is_active {
        color: #9760E4;
    }

    .is_show {
        display: block;
    }

</style>