import React, {Component} from "react";
import "./settings.css";
import DetectorSet from "./DetectorSet/DetectorSet";
import ViewSet from "./ViewSet/ViewSet";
import { connect } from 'react-redux';
import { setStartCon } from "../../AppSlice"; 
import AlgTest from "./AlgTest/AlgTest";
import Suppressor from "../../Suppressor/Suppressor";

class Settings extends Component{
    constructor(props){
        super(props)

        this.set_cmps = [
            <DetectorSet/>,
            <ViewSet/>,
            <AlgTest/>,
            <Suppressor/>
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
            if (this.props.app.is_con == true){
                this.props.actDetect(true)
            }
        }else{
            this.props.actDetect(false)
        }
        this.props.setStartCon({key: "is_detect_act", value: (result=="active"?true:false)})
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
                }:(this.state.cur_cmp==1 ?
                    {
                        gr_colors:this.props.gr_colors,
                        changeColors:this.props.changeColors
                    }:{
                        updateModal:this.props.updateModal,
                        algTestStart:this.props.algTestStart,
                        alg_test_res:this.props.alg_test_res,
                        is_alg_test: this.props.is_alg_test
                    })
            )
        )
        return(
            <div className="settings">
                <div className="nav">
                    <button 
                        className={"set "+(this.state.cur_cmp==0?"active":"")} 
                        onClick={() => {this.changeCmp(0)}}>
                            1
                    </button>
                    <button 
                        className={"set "+(this.state.cur_cmp==1?"active":"")} 
                        onClick={() => {this.changeCmp(1)}}>
                            2
                    </button>
                    <button
                        className={"set "+ (this.state.cur_cmp==2?"active":"")}
                        onClick={() => {this.changeCmp(2)}}>
                        3
                    </button>
                    <button
                        className={"set "+(this.state.cur_cmp==3?"active":"")}
                        onClick={() => {this.changeCmp(3)}}>
                        4
                    </button>
                </div>
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
        "setStartCon": (data) => dispatch(setStartCon(data))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Settings)