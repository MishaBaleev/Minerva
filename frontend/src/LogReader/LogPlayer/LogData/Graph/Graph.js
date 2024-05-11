import React, {Component} from "react";
import {Line} from "react-chartjs-2";

class Graph extends Component{
    constructor(props){
        super(props)
    }

    render(){
        let data = {
            labels: this.props.data.map((item, index) => {return (index+1)}),
            color: "whitesmoke",
            datasets: [{
                data: this.props.data,
                label: "",
                borderColor: "#00ff00",
                fill: true,
                lineTension: 0.5
            }]
        }
        let options = {
            plugins: {
                legend: {
                    display: false
                },
                annotation: {
                    annotations: [
                        // {
                        //     type: "box",
                        //     xMin: 0,
                        //     xMax: 81,
                        //     yMin: this.props.cur_frame.crit_level-0.25,
                        //     yMax: this.props.cur_frame.crit_level+0.25,
                        //     backgroundColor: this.props.colors.help_line,
                        //     borderWidth: 0,
                        //     borderRadius: 42
                        // },
                        // {
                        //     type: "box",
                        //     xMin: 10,
                        //     xMax: 20,
                        //     yMin: 0,
                        //     yMax: 50,
                        //     backgroundColor: "transparent",
                        //     borderWidth: 5,
                        //     borderColor: this.props.colors.help_line,
                        //     borderRadius: 0
                        // }
                    ],
                }
            },
            scales:{
                y:{
                    grid:{
                        color: "whiteSmoke"
                    },
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
            <div className="graph">
                <Line
                    type="line"
                    data={data} 
                    options={options}
                />
            </div>
        )
    }
}

export default Graph