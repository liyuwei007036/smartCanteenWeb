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
                    <span :class="{is_active:actives === 'month','statistics-tab':true}" style="padding: 0 10px"
                          @click="click('month')">本月</span>
                    <span :class="{is_active:actives === 'year','statistics-tab':true}" style="padding: 0 10px"
                          @click="click('year')">全年</span>
                </div>
            </div>
            <div style="display: flex;align-items: center;padding: 0 0">
                <div id="Histogram" style="height: 340px;width: 80%">

                </div>
                <div class="statistics_right">
                    <div id="pieChat" style="height: 100%;width: 100%">
                    </div>
                </div>
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
    import {dayChat, lineChat, monthChat, yearChat} from "../api/dateSummary";


    export default {
        name: "dataStatistics",
        data() {
            return {
                chartColumn: null,
                isDayChart: false,
                isWeekChart: false,
                isMonthChart: false,
                isYearChart: true,
                actives: 'year',
                is_show: 'year',
                totalSale: 0,
                avg: 0,
            }
        },
        beforeCreate() {
        },
        mounted() {
            let that = this
            setTimeout(function () {
                that.initUpdate()
            }, 3000)
            this.actives = sessionStorage.getItem('summarySearch') || 'day'
            this.drawLine();
            this.drawPieChat();
            this.drawHistogram();
            if (this.actives === 'year') {
                this.getYearChat()
            } else if (this.actives === 'month') {
                this.getMonthChat();
            } else if (this.actives === 'day') {
                this.getDayChat();
            }
        },
        destroyed() {
            let that = this
            if (that.socket.ws && that.socket.ws.readyState === 1) {
                let token = sessionStorage.getItem('x-smart-token') || 'x';
                that.socket.ws.send(JSON.stringify({
                    start: false,
                    type: 'summary',
                    token: token
                }))
            }
        },
        methods: {
            async getYearChat() {
                const that = this
                let res = await yearChat();
                if (res && res.code === 1000) {
                    that.updateHistogramData(res.data, 'year');
                    that.updatePieChat(res.data);
                }
            },
            updateHistogramData(res, type) {
                this.totalSale = res.total
                this.avg = res.avg
                let data = res.data
                let that = this
                let HistogramX = []
                let HistogramY = []
                for (let x of data) {
                    HistogramX.push(x.key)
                    HistogramY.push(x.value)
                }
                this.Histogram.setOption({
                    tooltip: {
                        formatter: function (params) {
                            if (type === 'year') {
                                return '' + params[0].axisValueLabel + '' + '</br>' + params[0].marker + ' ' + params[0].seriesName + ': ' + that.formatMoney(params[0].value)
                            } else if (type === 'month') {
                                return '' + params[0].axisValueLabel + '' + '</br>' + params[0].marker + ' ' + params[0].seriesName + ': ' + that.formatMoney(params[0].value)
                            } else if (type === 'day') {
                                let times = params[0].axisValueLabel.split('-')
                                return `${times[0]}-${times[1]}-${times[2]} ${times[3]} 时` + '</br>' + params[0].marker + ' ' + params[0].seriesName + ': ' + that.formatMoney(params[0].value)
                            }
                        }
                    },
                    xAxis: {
                        axisLabel: {
                            margin: 20,
                            formatter: function (value, index) {
                                if (type === 'year') {
                                    return value.split('-')[1] + '月'
                                } else if (type === 'month') {
                                    return value.split('-')[2]
                                } else if (type === 'day') {
                                    return value.split('-')[3]
                                }
                            }
                        },
                        data: HistogramX
                    },
                    series: [{
                        name: '销售额',
                        type: 'bar',
                        barWidth: '50%',
                        data: HistogramY
                    }]
                })
            },
            updatePieChat(res) {
                let total = res.total
                let recharge = res.recharge
                let fillBuckle = res.fillBuckle
                let refund = res.refund

                this.pieChat.setOption({
                    series: [
                        {
                            data: [
                                {value: total, name: '充值总额'},
                                {value: recharge, name: '退费总额'},
                                {value: fillBuckle, name: '补扣总额'},
                                {value: refund, name: '消费总额'},
                            ]
                        }
                    ]
                });

            },
            async getMonthChat() {
                const that = this
                let res = await monthChat();
                if (res && res.code === 1000) {
                    that.updateHistogramData(res.data, 'month');
                    that.updatePieChat(res.data);
                }
            },
            async getDayChat() {
                const that = this;
                let res = await dayChat();
                if (res && res.code === 1000) {
                    that.updateHistogramData(res.data, 'day');
                    that.updatePieChat(res.data);
                }
            },
            drawHistogram() {
                this.Histogram = echarts.init(document.getElementById('Histogram'));
                this.Histogram.setOption({
                    color: ['#1890FF'],
                    tooltip: {
                        trigger: 'axis',
                        backgroundColor: 'rgba(50,50,50,0.9)',
                        padding: [
                            15,  // 上
                            10, // 右
                            15,  // 下
                            10, // 左
                        ], axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        },
                    },
                    grid: {
                        top: '10%',
                        bottom: '10%'
                    },
                    xAxis: {
                        type: 'category',
                        axisTick: {
                            alignWithLabel: true
                        },
                        data: [],
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
                                        offset: 0, color: '#fff'
                                    }, {
                                        offset: 1, color: '#fff'
                                    }],
                                    global: false
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
                    series: []
                });
            },
            drawPieChat() {
                this.pieChat = echarts.init(document.getElementById('pieChat'));
                this.pieChat.setOption({
                    color: ['rgb(82,95,255)', 'rgb(64,211,177)', "rgb(249,116,55)", "rgb(211,21,181)"],
                    aria: {
                        show: true
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b}: {c} ({d}%)'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'center',
                        bottom: '1%',
                        formatter: function (a) {
                            return a;
                        },
                        data: ['充值总额', '退费总额', '补扣总额', '消费总额']
                    },
                    grid: {
                        show: true,
                        left: 0,
                        top: 0,
                        bottom: 0,
                    },
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            bottom: '20%',
                            radius: ['60%', '40%'],
                            center: ['50%', '50%'],//控制圆位置
                            stillShowZeroSum: true,
                            avoidLabelOverlap: false,
                            hoverOffset: 3,
                            selectedOffset: 3,
                            label: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: '10',
                                    fontWeight: 'bold'
                                }
                            },
                            labelLine: {
                                show: false
                            },
                            data: []
                        }
                    ]
                });
            },
            drawLine() {
                this.chartColumn = echarts.init(document.getElementById('chartColumn'));
                this.getLineChatData()

            },
            async getLineChatData() {
                let res = await lineChat()
                if (res && res.code === 1000) {
                    let data = res.data
                    this.drawLineChat(data)
                }
            },
            drawLineChat(data) {
                let lineChatX = []
                let lineChatY = []
                for (let x in data) {
                    lineChatX.push(x)
                    lineChatY.push(data[x])
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
                        data: [{
                            icon: 'circle',
                            name: '消费次数',
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
                        axisLabel: {
                            margin: 20,
                            formatter: function (value, index) {
                                // 格式化成月/日，只在第一个刻度显示年份
                                return new Date(value.replace(/-/g, '/')).format("hh:mm");
                            }
                        }, axisTick: {
                            alignWithLabel: true
                        },
                        data: lineChatX,
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
                        name: '消费次数',
                        data: lineChatY,
                        type: 'line'
                    }]
                });
            },
            click(i) {
                this.actives = i
                if (i === 'month') {
                    this.getMonthChat()
                } else if (i === 'year') {
                    this.getYearChat()
                } else if (i === 'day') {
                    this.getDayChat()
                }
                sessionStorage.setItem('summarySearch', i)
            },
            formatMoney(number, places, symbol, thousand, decimal) {
                number = number || 0;
                places = !isNaN(places = Math.abs(places)) ? places : 2;
                symbol = symbol !== undefined ? symbol : "&#xA5; ";
                thousand = thousand || ",";
                decimal = decimal || ".";
                var negative = number < 0 ? "-" : "",
                    i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
                    j = (j = i.length) > 3 ? j % 3 : 0;
                return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
            },
            async initUpdate() {
                let that = this
                if (that.socket.ws && that.socket.ws.readyState === 1) {
                    that.socket.ws.send(JSON.stringify({
                        start: true,
                        type: 'summary',
                        token: sessionStorage.getItem('x-smart-token')
                    }))
                    that.socket.ws.onmessage = this.getMessage
                }
            },
            getMessage(e) {
                let data = JSON.parse(e.data)
                console.log(data[`${this.actives}`], this.actives)
                this.updateHistogramData(data[`${this.actives}`], this.actives)
                this.drawLineChat(data.line)
            },
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

    .statistics_right {
        border: 1px solid #2E6CFE;
        width: 20%;
        height: 280px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .total_sales_amount {
        padding: 20px 0 10px 20px;
        border-bottom: 1px solid #DEDEDE;
        color: #2E6CFE;
        vertical-align: center;
        font-weight: bold;
        font-size: 16px;
    }

    .total_amount {
        font-size: 30px;
        font-weight: bold;
        color: #000;
        padding: 0 15px 20px
    }

    .rate {
        display: flex;
        align-items: center;
        padding: 0 20px
    }

    .rate_num {
        width: 50%;
        font-size: 14px;
        color: #888;
    }

    .el-icon-caret-top {
        color: #52C41A;
        font-size: 16px;
        padding: 10px
    }

    .el-icon-caret-bottom {
        color: #F5222D;
        font-size: 16px;
        padding: 10px
    }

    .day_sales_amount {
        margin: 0 20px;
        padding: 15px 0;
        border-top: 1px solid #DEDEDE;
        color: #888888;
        vertical-align: center;;
        font-size: 14px;
    }
</style>