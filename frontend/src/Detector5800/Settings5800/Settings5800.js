import React, {Component} from "react";
import DetView5800 from "./DetView5800/DetView5800";
import ColView5800 from "./ColView5800/ColView5800";
import { connect } from "react-redux";
import { setStartCon433 } from "../../AppSlice";

class Settings5800 extends Component{
    constructor(props){
        super(props)

        this.state = {
            cur_cmp: 0,
            det_state: ""
        }

        this.set_cmps = [
            <DetView5800/>,
            <ColView5800/>
        ]

        this.changeCmp = this.changeCmp.bind(this)
        this.actDet = this.actDet.bind(this)
    }

    changeCmp(value){
        this.setState(state => ({
            cur_cmp: value
        }))
    }

    actDet(){
        let result = ""
        if (this.state.det_state == ""){
            result = "active"
            if (this.props.app.is_con433 == true){
                this.props.actDet(true)
            }
        }else{
            this.props.actDet(false)
        }
        this.props.setStartCon433({key: "is_detect_act", value: (result=="active"?true:false)})
        this.setState(state => ({
            det_state: result
        }))
    }

    render(){
        let cmp = React.cloneElement(this.set_cmps[this.state.cur_cmp], 
            (this.state.cur_cmp==0?
                {
                    updateModal:this.props.updateModal,
                    det_state: this.state.det_state,
                    actDet: this.actDet,
                    zone_state: this.props.zone_state
                }:
                {
                    gr_colors:this.props.gr_colors,
                    changeColors:this.props.changeColors
                }
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
    "setStartCon5800": (data) => dispatch(setStartCon433(data))
}
}
  export default connect(mapStateToProps, mapDispatchToProps)(Settings5800)