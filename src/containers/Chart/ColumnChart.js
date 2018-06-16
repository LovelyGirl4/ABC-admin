// 完成问卷统计
import React from 'react';
import { connect } from 'react-redux';
import echarts from 'echarts';
import { fetchColumnChart } from '../../actions/chartAction';

class ColumnChart extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log('fetchColumnChart7777');
        this.props.fetchColumnChart();
        this.myChart = echarts.init(this.lineChart);
    }

    componentWillReceiveProps(nextProps) {
        // 绘制图表
        const {data} = nextProps;
        let seriesData30 = [], seriesData50 = [], xAxisData = [];
        data.forEach(d => {
            const date = new Date(d.date);
            seriesData30.push(d.min_quota);
            seriesData50.push(d.max_quota);
            xAxisData.push(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
        });
        const option = this._calcOption({xAxisData, seriesData30, seriesData50});
        this.myChart.setOption(option);
    }
    _calcOption = ({xAxisData, seriesData30, seriesData50}) => {
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                }
            },
            // toolbox: {
            //     feature: {
            //         dataView: {show: true, readOnly: false},
            //         magicType: {show: true, type: ['bar']},
            //         restore: {show: true},
            //         saveAsImage: {show: true}
            //     }
            // },
            legend: {
                data: ['30万', '50万']
            },
            xAxis: [
                {
                    type: 'category',
                    data: xAxisData,
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '数量',
                    // min: 0,
                    // max: 250,
                    interval: 1,
                    axisLabel: {
                        // formatter: '{value}'
                    },
                    axisPointer: {
                        label: {
                            formatter: (params) => params.value.toFixed(0)
                        },
                        z: 100,
                    },
                }
            ],
            series: [
                {
                    name: '30万',
                    type: 'bar',
                    data: seriesData30
                },
                {
                    name: '50万',
                    type: 'bar',
                    data: seriesData50
                }
            ]
        };
        return option;
    }

    render() {
        const width = document.body.clientWidth - 200;
        const height = document.body.clientHeight - 150;
        return <div id="lineChart" style={{width: width, height: height}} ref={chart => (this.lineChart = chart)}>
        </div>;
    }
}

export default connect(
    ({chart}) => ({
        data: chart.data.column
    }),
    {fetchColumnChart},
)(ColumnChart);
