import React, {Component} from "react";
import {Bar} from "react-chartjs-2";

class Graph443 extends Component{
    constructor(props){
        super(props)
    }

    render(){
        let data = {
            labels: this.props.xticks,
            color: "whitesmoke",
            datasets: [{
                data: this.props.data,
                label: "",
                backgroundColor: this.props.color,
                fill: true
            }]
        }
        let options = {
            plugins: {
                legend: {
                    display: false
                },
            },
            scales:{
                y:{
                    grid:{
                        color: "whiteSmoke"
                    },
                    suggestedMin:0, 
                    suggestedMax:95,
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
            <Bar 
                type="Bar"
                options={options}
                data={data}
            />
        )
    }
}

export default Graph443