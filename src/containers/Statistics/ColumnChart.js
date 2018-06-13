// 完成问卷统计
import React from 'react';
import { connect } from 'react-redux';
import echarts from 'echarts';

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
            data: ['1号', '2号', '3号', '4号', '5号', '6号', '7号', '8号', '9号', '10号', '11号', '12号'],
            axisPointer: {
                type: 'shadow'
            }
        }
    ],
    yAxis: [
        {
            type: 'value',
            name: '数量',
            min: 0,
            max: 250,
            interval: 50,
            axisLabel: {
                formatter: '{value}'
            }
        }
    ],
    series: [
        {
            name: '30万',
            type: 'bar',
            data: [2, 5, 7, 23, 25, 76, 135, 162, 32, 20, 6, 3]
        },
        {
            name: '50万',
            type: 'bar',
            data: [4, 6, 9, 26, 28, 70, 175, 182, 48, 18, 8, 2]
        }
    ]
};

class ColumnChart extends React.Component {
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
        const height = document.body.clientHeight - 150;
        return <div id="lineChart" style={{width: width, height: height}} ref={chart => (this.lineChart = chart)}>
        </div>;
    }
}

export default connect(
    () => ({ }),
    {},
)(ColumnChart);
