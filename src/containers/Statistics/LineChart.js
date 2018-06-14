// 用户数统计
import React from 'react';
import { connect } from 'react-redux';
import echarts from 'echarts';

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
        data: ['1号', '2号', '3号', '4号', '5号', '6号', '7号']
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line'
    }]
};

class LineChart extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.myChart = echarts.init(this.lineChart);
        // 绘制图表
        this.myChart.setOption(option);
    }

    render() {
        const width = document.body.clientWidth - 200;
        const height = document.body.clientHeight - 160;
        return <div id="lineChart" style={{width: width, height: height}} ref={chart => (this.lineChart = chart)}>
        </div>;
    }
}

export default connect(
    () => ({ }),
    {},
)(LineChart);
