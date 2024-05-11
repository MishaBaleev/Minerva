import React, {Component} from "react";
import "./testGraph.css";
import {Line} from "react-chartjs-2";

class TestGraph extends Component{
    constructor(props){
        super(props)
    }

    render(){
        let data = {
            labels: this.props.data.map((item, index) => {return index+1}),
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
            <div className="test_graph">
                <Line
                    type="line"
                    data={data} 
                    options={options}
                />
            </div>
        )
    }
}

export default TestGraph