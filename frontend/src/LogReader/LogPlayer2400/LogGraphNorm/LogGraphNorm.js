import React, {Component} from "react";
import {Bar} from "react-chartjs-2";
import '../LogGraph/logGraph.css'

class LogGraphNorm extends Component{
    constructor(props){
        super(props)

        this.xTicks = new Array(82).fill(0).map((item, index) => {
            return index+2401
        })
    }

    render(){
        let data = {
            labels: this.xTicks,
            color: "whitesmoke",
            datasets: [{
                data: JSON.parse(this.props.cur_frame.norm_freq_arr),
                label: "",
                backgroundColor: this.props.colors.graph,
                fill: true
            }]
        }
        let options = {
            plugins: {
                legend: {
                    display: false
                },
                annotation: {
                    annotations: [
                        
                    ],
                }
            },
            scales:{
                y:{
                    grid:{
                        color: "whiteSmoke"
                    },
                    suggestedMin:0, suggestedMax:1,
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
            <div className="logGraph">
                <div>
                    <Bar 
                        type="Bar"
                        options={options}
                        data={data}
                    />
                </div>
            </div>
        )
    }
}

export default LogGraphNorm

