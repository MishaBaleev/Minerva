import React, {Component} from "react";
import {Line} from "react-chartjs-2";
import "./graphA.css"

class GraphA extends Component{
    constructor(props){
        super(props)
    }

    getAvValue(arr){
        let summ = 0
        arr.forEach(item => {
            summ += item
        })
        return summ/arr.length
    }

    render(){
        let data = {
            labels: this.props.time,
            color: "whitesmoke",
            datasets: [{
                data: this.props.data,
                label: "",
                borderColor: "#00ff00",
                fill: true,
                lineTension: 0.1
            }]
        }
        let options = {
            plugins: {
                legend: {
                    display: false,
                },
                annotation: this.props.is_av==true?{
                    annotations: this.props.data.length==0?[]:
                    [
                        {
                            type: 'line',
                            yMin: this.getAvValue(this.props.data),
                            yMax: this.getAvValue(this.props.data),
                            borderColor: '#ff0000',
                            borderWidth: 4
                        }
                    ],
                }:{}
            },
            scales:{
                y:{
                    grid:{
                        color: "whiteSmoke"
                    },
                    suggestedMin:0,
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
        return(
            <div className="graphA">
                <p className="title">{this.props.title}</p>
                <Line
                    type="line"
                    data={data} 
                    options={options}
                />
            </div>
        )
    }
}

export default GraphA