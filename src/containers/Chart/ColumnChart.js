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
        this.props.fetchColumnChart();
        this.myChart = echarts.init(this.lineChart);
    }

    componentWillReceiveProps(nextProps) {
        // 绘制图表
        const {data} = nextProps;
        let seriesData30 = [], seriesData50 = [], xAxisData = [];
        data.forEach(d => {
            seriesData30.push(d.min_quota);
            seriesData50.push(d.max_quota);
            xAxisData.push(d.date.slice(0, 10));
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
                    name: '日期',
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
                    minInterval: 1,
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
