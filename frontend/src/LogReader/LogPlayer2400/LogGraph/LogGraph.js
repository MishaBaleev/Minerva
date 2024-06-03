import React, {Component} from "react";
import "./logGraph.css";
import {Bar} from "react-chartjs-2";

class LogGraph extends Component{
    constructor(props){
        super(props)

        this.xTicks = new Array(82).fill(0).map((item, index) => {
            return index+2401
        })

        this.getColors = this.getColors.bind(this)
    }

    getColors(){
        let colors = new Array(82).fill(this.props.colors.graph)
        let zone_state = JSON.parse(this.props.cur_frame.zone_state)
        if (zone_state.type == 1){
            zone_state.targets.forEach(item => {
                for (let i = item[0]; i <= item[1]; i++){
                    colors[i] = this.props.colors.warning
                }
            })
        }
        return colors
    }

    render(){
        let data = {
            labels: this.xTicks,
            color: "whitesmoke",
            datasets: [{
                data: this.props.freq_arr,
                label: "",
                backgroundColor: this.getColors(),
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
                        {
                            type: "box",
                            xMin: 0,
                            xMax: 81,
                            yMin: this.props.cur_frame.crit_level-0.25,
                            yMax: this.props.cur_frame.crit_level+0.25,
                            backgroundColor: this.props.colors.help_line,
                            borderWidth: 0,
                            borderRadius: 42
                        },
                        {
                            type: "box",
                            xMin: this.props.graph_zone.length==0?(-1):this.props.graph_zone[0],
                            xMax: this.props.graph_zone.length==0?(-1):this.props.graph_zone[1],
                            yMin: 0,
                            yMax: 50,
                            backgroundColor: "transparent",
                            borderWidth: 5,
                            borderColor: this.props.colors.help_line,
                            borderRadius: 0
                        }
                    ],
                }
            },
            scales:{
                y:{
                    grid:{
                        color: "whiteSmoke"
                    },
                    suggestedMin:0, suggestedMax:50,
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

export default LogGraph