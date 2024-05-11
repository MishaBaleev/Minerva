import React, {Component} from "react";
import "./detView443.css";

class DetView443 extends Component{
    constructor(props){
        super(props)

        this.zone_states = [
            "Не определено",
            "Аномалия",
            "Аномалии не обнаружены"
        ]
    }

    render(){
        return <div className="det_set_433">
            <div className="detection">
                <div className="title">
                    <button className={this.props.det_state} onClick={this.props.actDet}>
                        <div className={this.props.det_state}/>
                    </button>
                    <p>Анализ</p>
                </div>
                <p className={"det_res col_"+this.props.zone_state.type}>{this.zone_states[this.props.zone_state.type]}</p>
            </div>
        </div>
    }
}

export default DetView443