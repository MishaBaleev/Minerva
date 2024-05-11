import React, {Component} from "react";
import "./graph.css";
import {Bar} from "react-chartjs-2";

class Graph extends Component{
    constructor(props){
        super(props) 
        this.xTicks = new Array(82).fill(0).map((item, index) => {
            return index+2401
        })

        this.getColor = this.getColor.bind(this)
    }
    componentDidMount(){
        
    }
    getColor(arr){
        let result_arr = new Array(82).fill(this.props.gr_colors.graph)
        arr.forEach(item => {
            for (let i=item[0]; i<=item[1]; i++){
                result_arr[i] = this.props.gr_colors.warning
            }
        })
        return result_arr
    }
    render(){
        let data = {
            labels: this.xTicks,
            color: "whitesmoke",
            datasets: [{
                data: this.props.freq_arr,
                label: "",
                backgroundColor: this.getColor(this.props.targets),
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
                            type: 'line',
                            yMin: Number(this.props.crit_level),
                            yMax: Number(this.props.crit_level),
                            borderColor: this.props.gr_colors.help_line,
                            borderWidth: 4
                        },
                        {
                            type: "box",
                            xMin: this.props.temp_block.length==0?(-1):this.props.temp_block[0],
                            xMax: this.props.temp_block.length==0?(-1):this.props.temp_block[1],
                            yMin: 0,
                            yMax: 50,
                            backgroundColor: "transparent",
                            borderWidth: 5,
                            borderColor: this.props.gr_colors.help_line,
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
            <div className="d-graph">
                <Bar 
                    type="Bar"
                    options={options}
                    data={data}
                />
            </div>
        )
    }
}

export default Graph 