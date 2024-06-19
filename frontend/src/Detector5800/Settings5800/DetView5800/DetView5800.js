import React, {Component} from "react";
import "./detView5800.scss";

class DetView5800 extends Component{
    constructor(props){
        super(props)

        this.zone_states = [
            "Не определено",
            "Аномалия",
            "Аномалии не обнаружены"
        ]
    }

    render(){
        return <div className="det_set_5800">
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

export default DetView5800