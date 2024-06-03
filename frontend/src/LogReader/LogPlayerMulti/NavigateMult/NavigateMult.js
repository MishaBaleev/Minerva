import React, {Component} from "react";
import Data_set from "./Data_set";
import Nav_set from "./Nav_set";

class NavigateMult extends Component{
    constructor(props){
        super(props)

        this.set_cmps = [
            <Nav_set/>,
            <Data_set/>
        ]

        this.state = {
            act_set: 0,
            cur_cmp: 0
        }

        this.changeCmp = this.changeCmp.bind(this)
    }

    changeCmp(value){
        this.setState(state => ({
            cur_cmp: value
        }))
    }

    render(){
        let cmp = React.cloneElement(this.set_cmps[this.state.cur_cmp], 
            (this.state.cur_cmp==0?{
                cur_frame: this.props.cur_frame,
                setCurFrame: this.props.setCurFrame,
                nextFrame: this.props.nextFrame,
                prevFrame: this.props.prevFrame,
                stat_data: this.props.stat_data,
                setRecord: this.props.setRecord,
                setRecordSpeed: this.props.setRecordSpeed,
                refresh: this.props.refresh,
                is_play: this.props.is_play,
                record_speed: this.props.record_speed
            }:{
                cur_arrs: this.props.cur_arrs
            })
        )
        return <div className="nav_mult">
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
            <div className="set_block">
                {cmp}
            </div>
        </div>
    }
}

export default NavigateMult