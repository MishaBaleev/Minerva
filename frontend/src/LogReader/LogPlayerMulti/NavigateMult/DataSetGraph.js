import React, {Component} from "react";
import { Line } from "react-chartjs-2";

class DataSetGraph extends Component{
    constructor(props){
        super(props)
    }

    getAvValue(data){
        let summ = 0
        data.forEach(item => {
            summ += item
        })
        return summ/data.length
    }

    render(){
        let data = {
            labels: this.props.xTicks,
            color: "whitesmoke",
            datasets: [{
                data: this.props.data,
                label: "",
                borderColor: "#00ff00",
                fill: true
            }]
        }
        let options = {
            plugins: {
                legend: {
                    display: false
                },
                annotation: {
                    annotations:
                    [
                        {
                            type: 'line',
                            yMin: this.getAvValue(this.props.data),
                            yMax: this.getAvValue(this.props.data),
                            borderColor: '#ff0000',
                            borderWidth: 4
                        }
                    ],
                }
            },
            scales:{
                y:{
                    grid:{
                        color: "whiteSmoke"
                    },
                    suggestedMin:0, suggestedMax:this.props.yMax,
                    ticks:{
                        color: "whitesmoke"
                    }
                },
                x:{
                    grid:{
                        color: "whitesmoke"
                    },
                    ticks:{
                        color: "whitesmoke"
                    }
                }
            }
        }
        return <div className="DS_graph">
            <p className="DS_title">{this.props.title}</p>
            <div className="graph">
                <Line 
                    type="Bar"
                    options={options}
                    data={data}
                />
            </div>
        </div>
    }
}

export default DataSetGraph