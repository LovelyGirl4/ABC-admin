// 用户数统计
import React from 'react';
import { connect } from 'react-redux';
import echarts from 'echarts';
import { fetchLineChart } from '../../actions/chartAction';


class LineChart extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchLineChart();
        this.myChart = echarts.init(this.lineChart);
    }

    componentWillReceiveProps(nextProps) {
        const {data} = nextProps;
        let seriesData = [], xAxisData = [];
        data.forEach(d => {
            seriesData.push(d.count);
            xAxisData.push(d.date.slice(0, 10));
        });
        console.log('data:', data);
        const option = this._calcOption({xAxisData, seriesData});
        // 绘制图表
        this.myChart.setOption(option);
    }

    _calcOption = ({xAxisData, seriesData}) => {
        const option = {
            tooltip: {
                show: 'true',
                trigger: 'axis',
                axisPointer: {
                    type: 'line'
                }
            },
            xAxis: {
                type: 'category',
                name: '日期',
                boundaryGap: false,
                data: xAxisData
            },
            yAxis: {
                type: 'value',
                name: '数量',
                minInterval: 1,
            },
            series: [{
                data: seriesData,
                type: 'line',
                // showSymbol: false
            }]
        };
        return option;
    }

    // _clacData = (data) => {
    //     let seriesData = [], xAxisData = [];
    //     data.forEach(d => {
    //         const date = new Date(data.Date);
    //         seriesData.push(d.count);
    //         xAxisData.push(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
    //     });
    //     return {};
    // };

    render() {
        const width = document.body.clientWidth - 200;
        const height = document.body.clientHeight - 160;
        return <div id="lineChart" style={{width: width, height: height}} ref={chart => (this.lineChart = chart)}>
        </div>;
    }
}

export default connect(
    ({chart}) => ({
        data: chart.data.line
    }),
    {fetchLineChart},
)(LineChart);
