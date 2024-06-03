import React, {Component} from "react";
import {Bar} from "react-chartjs-2";

class GraphM extends Component{
    constructor(props){
        super(props)
    }

    render(){
        let data = {
            labels: this.props.xTicks,
            color: "whitesmoke",
            datasets: [{
                data: this.props.data,
                label: "",
                backgroundColor: "#00ff00",
                fill: true
            }]
        }
        let options = {
            plugins: {
                legend: {
                    display: false
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
        return <div className="graphM">
            <p className="titleM">{this.props.title}</p>
            <Bar 
                type="Bar"
                options={options}
                data={data}
            />
        </div>
    }
}

export default GraphM