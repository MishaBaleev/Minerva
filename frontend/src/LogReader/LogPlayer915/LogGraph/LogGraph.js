import React, {Component} from "react";
import "./logGraph.css";
import {Bar} from "react-chartjs-2";
import Graph443 from "./Graph443";

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
        return(
            <div className="logGraph">
                <div>
                    <Graph443
                        title="800-850"
                        data={this.props.freq_arr}
                        xticks={Array(101).fill(0).map((_, index) => {return index+820})}
                        color={this.props.colors.graph}
                    />
                </div>
            </div>
        )
    }
}

export default LogGraph