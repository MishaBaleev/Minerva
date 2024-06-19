import React, {Component} from "react";
import "./logGraph.css";
import Graph5800 from "./Graph5800";

class LogGraph extends Component{
    constructor(props){
        super(props)

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
                    <Graph5800
                        title="800-850"
                        data={this.props.freq_arr}
                        xticks={Array(301).fill(0).map((_, index) => {return index+5645})}
                        color={this.props.colors.graph}
                    />
                </div>
            </div>
        )
    }
}

export default LogGraph