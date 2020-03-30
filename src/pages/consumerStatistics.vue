<template>
    <div class="statistics">

        <div style="background-color: #fff;padding:14px 0;margin-bottom: 10px;border-radius: 4px;box-shadow: 0 0 6px 0 #DFDFDF;">
            <div style="margin-left: 20px;color: #666666;font-size: 14px;height: 30px;line-height: 30px">
                <div :class="{is_active:actives === 'day','statistics-tab':true}"
                     style="border-top-left-radius: 4px;border-bottom-left-radius: 4px"
                     @click="click('day')">今日
                </div>
                <div :class="{is_active:actives === 'month','statistics-tab':true}"
                     style="margin-left: -1px;"
                     @click="click('month')">本月
                </div>
                <div :class="{is_active:actives === 'year','statistics-tab':true}"
                     style="border-top-right-radius: 4px;border-bottom-right-radius: 4px;margin-left: -1px;"
                     @click="click('year')">全年
                </div>
                <el-form :inline="true" class="demo-form-inline" style="float: left;margin-right: 20px">
                    <div class="block" style="height: 30px;line-height: 30px;">
                        <el-date-picker
                                v-model="value1"
                                type="monthrange"
                                range-separator="至"
                                start-placeholder="开始月份"
                                value-format="yyyy-MM-dd"
                                format="yyyy-MM"
                                end-placeholder="结束月份"
                                :picker-options="pickerOptions">
                        </el-date-picker>
                    </div>
                    <el-button type="primary" class="search-btn-primary" @click="searchOther()" icon="el-icon-search"
                               style="height: 30px;line-height: 30px;margin-left: 10px">查询
                    </el-button>
                </el-form>
            </div>
        </div>

        <div style="display: flex;align-items: center">

            <div style="background-color: #fff;padding:0 20px 15px;margin-bottom: 10px;width: 80%;margin-right: 20px;border-radius: 4px;box-shadow: 0 0 6px 0 #DFDFDF;">
                <div style="border-bottom: 1px solid #DDDFE6">
                    <div style="font-size: 14px;display:inline-block;padding: 16px 0px;color: #333333;font-weight: bold">
                        销售额
                    </div>

                </div>
                <div id="Histogram" style="height: 300px">
                </div>
            </div>

            <div style="background-color: #fff;padding:0 20px 15px;margin-bottom: 10px;;width: 20%;border-radius: 4px;box-shadow: 0 0 6px 0 #DFDFDF;">
                <div style="border-bottom: 1px solid #DDDFE6">
                    <div style="font-size: 14px;display:inline-block;padding: 16px 0px;color: #333333;font-weight: bold">
                        总金额占比
                    </div>
                </div>
                <div id="pieChat" style="height: 300px">
                </div>
            </div>

        </div>

        <div style="background-color: #fff;padding:0 20px 15px;margin-bottom: 0px;border-radius: 4px;box-shadow: 0 0 6px 0 #DFDFDF;">
            <div style="border-bottom: 1px solid #DDDFE6">
                <div style="font-size: 14px;display:inline-block;padding: 16px 0px;color: #333333;font-weight: bold">
                    消费峰值统计
                </div>
            </div>
            <div id="chartColumn" style="height: 290px;">
            </div>
        </div>

    </div>
</template>

<script>
    import echarts from 'echarts'
    import {dayChat, other, monthChat, yearChat} from "../api/dateSummary";

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
                value1: [],
                pickerOptions: {
                    disabledDate: (time) => {
                        return time.getTime() > new Date();
                    }
                }
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
            } else if (this.actives === 'other') {
                this.getOtherChat();
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
                    that.updateLineChat(res.data.lineChat, 'year');
                }
            },
            async getMonthChat() {
                const that = this
                let res = await monthChat();
                if (res && res.code === 1000) {
                    that.updateHistogramData(res.data, 'month');
                    that.updatePieChat(res.data);
                    that.updateLineChat(res.data.lineChat, 'month');
                }
            },
            async getDayChat() {
                const that = this;
                let res = await dayChat();
                if (res && res.code === 1000) {
                    that.updateHistogramData(res.data, 'day');
                    that.updatePieChat(res.data);
                    that.updateLineChat(res.data.lineChat, 'day');
                }
            },
            searchOther() {
                let value = this.value1;
                if (value.length !== 2) {
                    return;
                }
                let start = new Date(value[0])
                let end = new Date(value[1])

                let startYear = start.getFullYear();
                let startMonth = start.getMonth();

                let endYear = end.getFullYear();
                let endMonth = end.getMonth();

                //通过年,月差计算月份差
                let months = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
                if (months > 12) {
                    this.$message.error('时间距离不能超过12个月')
                    return;
                }
                sessionStorage.setItem('SEARCH_SUMMARY', JSON.stringify(this.value1))
                sessionStorage.setItem('summarySearch', 'other')
                this.actives = 'other'
                this.getOtherChat();
            },
            async getOtherChat() {
                const that = this;
                let value = sessionStorage.getItem('SEARCH_SUMMARY');
                if (!value) {
                    return;
                }
                that.value1 = JSON.parse(value) || []
                let res = await other({
                    start: that.value1[0],
                    end: that.value1[1]
                });
                if (res && res.code === 1000) {
                    that.updateHistogramData(res.data, 'other');
                    that.updatePieChat(res.data);
                    that.updateLineChat(res.data.lineChat, 'other');
                }
            },
            drawHistogram() {
                this.Histogram = echarts.init(document.getElementById('Histogram'));
                this.Histogram.setOption({
                    tooltip: {
                        trigger: 'axis',
                        backgroundColor: 'rgba(50,50,50,0.9)',
                        padding: [
                            15,  // 上
                            10, // 右
                            15,  // 下
                            10, // 左
                        ],
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'none'        // 默认为直线，可选为：'line' | 'shadow'
                        },
                    },
                    grid: {
                        top: '10%',
                        bottom: '10%',
                        left: '13%',
                        right: '0%'
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
                let that = this
                this.pieChat = echarts.init(document.getElementById('pieChat'));
                this.pieChat.setOption({
                    color: ['rgb(211,21,181)', 'rgb(64,211,177)', "rgb(249,116,55)", 'rgb(82,95,255)'],
                    tooltip: {
                        trigger: 'item',
                        formatter: function (a) {
                            let c = that.formatMoney(a.value);
                            return `${a.marker} ${a.name}: ${c}  (${a.percent}%)`
                        }
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'center',
                        bottom: '0',
                        formatter: function (a) {
                            return a;
                        },
                        data: ['充值总额', '退费总额', '补扣总额', '消费总额']
                    },
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            bottom: '30%',
                            radius: ['90%', '60%'],
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
                                    fontSize: '12',
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
                this.chartColumn.setOption({
                    color: ['#FF5101'],
                    grid: {
                        top: '10%',
                        left: '10%',
                        right: '2%'
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
                    },
                    minInterval: 1,
                    xAxis: {
                        type: 'category',
                        axisTick: {
                            alignWithLabel: true
                        },
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
                });
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
                            if (type === 'month') {
                                return '' + params[0].axisValueLabel + '' + '</br>' + params[0].seriesName + ': ' + that.formatMoney(params[0].value)
                            } else if (type === 'day') {
                                let times = params[0].axisValueLabel.split('-')
                                return `${times[0]}-${times[1]}-${times[2]} ${times[3]} 时` + '</br>' + params[0].seriesName + ': ' + that.formatMoney(params[0].value)
                            } else {
                                return '' + params[0].axisValueLabel + '' + '</br>' + params[0].seriesName + ': ' + that.formatMoney(params[0].value)
                            }
                        }
                    },
                    xAxis: {
                        axisLabel: {
                            margin: 20,
                            formatter: function (value, index) {
                                if (type === 'month') {
                                    return value.split('-')[2]
                                } else if (type === 'day') {
                                    return value.split('-')[3]
                                } else {
                                    return value.split('-')[1] + '月'
                                }
                            }
                        },
                        data: HistogramX
                    },
                    series: [{
                        name: '销售额',
                        type: 'bar',
                        showBackground: false,
                        emphasis: {
                            itemStyle: {
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [{
                                        offset: 0, color: '#5BA5FF' // 0% 处的颜色
                                    }, {
                                        offset: 1, color: '#525FFF' // 100% 处的颜色
                                    }],
                                    global: false // 缺省为 false
                                }
                            }
                        },
                        itemStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0, color: '#20C8FC' // 0% 处的颜色
                                }, {
                                    offset: 1, color: '#E8FAFF' // 100% 处的颜色
                                }],
                            }
                        },
                        data: HistogramY
                    }]
                })
            },
            updatePieChat(res) {
                let that = this;
                let total = res.total
                let recharge = res.recharge
                let fillBuckle = res.fillBuckle
                let refund = res.refund
                this.pieChat.setOption({
                    legend: {
                        orient: 'vertical',
                        left: 'center',
                        bottom: '0',
                        formatter: function (a) {
                            let value;
                            if (a === '充值总额') {
                                value = that.formatMoney(recharge).replace('&#xA5;', '￥')
                            } else if (a === '退费总额') {
                                value = that.formatMoney(fillBuckle).replace('&#xA5;', '￥')
                            } else if (a === '补扣总额') {
                                value = that.formatMoney(refund).replace('&#xA5;', '￥')
                            } else if (a === '消费总额') {
                                value = that.formatMoney(total).replace('&#xA5;', '￥')
                            }
                            return `${a} ${value}`;
                        },
                        data: ['充值总额', '退费总额', '补扣总额', '消费总额']
                    },
                    series: [
                        {
                            data: [
                                {value: recharge, name: '充值总额'},
                                {value: fillBuckle, name: '退费总额'},
                                {value: refund, name: '补扣总额'},
                                {value: total, name: '消费总额'},
                            ]
                        }
                    ]
                });

            },
            updateLineChat(data, type) {
                let lineChatX = []
                let lineChatY = []
                for (let x in data) {
                    lineChatX.push(x)
                    lineChatY.push(data[x])
                }
                this.chartColumn.setOption({
                    tooltip: {
                        formatter: function (params) {
                            return params[0].axisValueLabel + '</br>' + params[0].seriesName + ': ' + params[0].value + '笔'
                        }
                    },
                    xAxis: {
                        axisLabel: {
                            margin: 20,
                            formatter: function (value, index) {
                                // 格式化成月/日，只在第一个刻度显示年份
                                if (type === 'month') {
                                    return new Date(value.replace(/-/g, '/')).format("dd");
                                } else if (type === 'day') {
                                    return new Date(value.replace(/-/g, '/')).format("hh:mm");
                                } else {
                                    return new Date(value.replace(/-/g, '/')).format("MM") + '月';
                                }
                            }
                        },
                        data: lineChatX
                    },
                    series: [{
                        type: 'line',
                        symbol: 'circle',
                        name: '消费次数',
                        smooth: 0.5,
                        dimensions: ['x', 'y'],
                        smoothMonotone: 'x',
                        data: lineChatY,
                        areaStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0, color: 'rgba(255, 81, 1, 0.2)' // 0% 处的颜色
                                }, {
                                    offset: 1, color: 'rgba(255, 255, 255)' // 100% 处的颜色
                                }],
                            }
                        }
                    }]
                })
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
                symbol = symbol !== undefined ? symbol : "&#xA5;";
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
                if (this.actives !== 'other') {
                    this.updateHistogramData(data[`${this.actives}`], this.actives)
                    this.updatePieChat(data[`${this.actives}`])
                    this.updateLineChat(data[`${this.actives}`].lineChat, this.actives)
                } else {
                    this.getOtherChat();
                }
            },
        }
    }
</script>

<style scoped>
    /deep/ .el-main {
        padding: 10px;
    }

    /deep/ .el-tabs__header {
        margin: 0;
    }

    .statistics-tab {
        padding: 0 10px;
        height: 30px;
        line-height: 30px;
        border: 1px solid #DDDFE6;;
        float: left;
        box-sizing: border-box;
        font-size: 12px;
    }

    .statistics-tab:hover, .statistics-tab:focus {
        background-color: #2E6CFE;
        cursor: pointer;
        color: #FFFFFF;
        border: 1px solid #2E6CFE;
    }

    .is_active {
        background-color: #2E6CFE;
        color: #FFFFFF;
        border: 1px solid #2E6CFE;
    }

    .is_show {
        display: block;
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

    .block {
        float: left;
        height: 30px;
        line-height: 30px;
        width: 231px;
        margin-left: 10px;
    }

    .el-dialog__body .el-date-editor.el-input, .el-date-editor.el-input__inner {
        width: 100%;
        height: 30px;
        line-height: 30px;
        display: flex;
        padding: 0 10px;
    }

    .el-date-editor /deep/ .el-range-input {
        height: 26px;
    }

    .el-date-editor /deep/ .el-range__icon {
        font-size: 14px;
        margin-left: -5px;
        color: #C0C4CC;
        float: left;
        line-height: 26px;
    }

    .el-input__icon .el-range__icon /deep/ .el-icon-date, .el-date-editor /deep/ .el-range-separator {
        height: 30px;
        line-height: 30px;
    }
</style>