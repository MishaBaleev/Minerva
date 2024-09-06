import React, {Component} from "react";
import DetSettings from "./DetSettings";
import { connect } from 'react-redux';
import { setStartConMultX3 } from "../../AppSlice"; 

class Settings extends Component{
    constructor(props){
        super(props)

        this.set_cmps = [
            <DetSettings/>
        ]

        this.state = {
            act_set: 0,
            cur_cmp: 0,
            act_an: ""
        }

        this.changeCmp = this.changeCmp.bind(this)
        this.actAn = this.actAn.bind(this)
    }

    changeCmp(value){
        this.setState(state => ({
            cur_cmp: value
        }))
    }

    actAn(){
        let result = ""
        if (this.state.act_an == ""){
            result = "active"
            if (this.props.app.is_conMultX3 == true){
                this.props.actDetect(true)
            }
        }else{
            this.props.actDetect(false)
        }
        this.props.setStartConMultX3({key: "is_detect_act", value: (result=="active"?true:false)})
        this.setState(state => ({
            act_an: result
        }))
    }

    render(){
        let cmp = React.cloneElement(this.set_cmps[this.state.cur_cmp], 
            (this.state.cur_cmp==0?
                {
                    actAn:this.actAn, 
                    act_an:this.state.act_an,
                    changeCritLev:this.props.changeCritLev,
                    zone_state: this.props.zone_state,
                    anom_type: this.props.anom_type,
                    temp_results: this.props.temp_results,
                    temp_time: this.props.temp_time,
                    showTempResult: this.props.showTempResult,
                    crit_level: this.props.crit_level
                }:{}
            )
        )
        return(
            <div className="settings_multX3">
                {/* <div className="nav">
                    <button 
                        className={"set "+(this.state.cur_cmp==0?"active":"")} 
                        onClick={() => {this.changeCmp(0)}}>
                            1
                    </button>
                </div> */}
                {cmp}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return state;
}
const mapDispatchToProps =  (dispatch) => {
    return {
        "setStartConMultX3": (data) => dispatch(setStartConMultX3(data))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Settings)