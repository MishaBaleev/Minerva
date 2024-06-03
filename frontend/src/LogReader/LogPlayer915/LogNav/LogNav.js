import React, {Component} from "react";
import "./logNav.css";
import NavSet from "./NavSet/NavSet";
import SettingsSet from "./SettingsSet/SettingsSet"

class LogNav extends Component{
    constructor(props){
        super(props)

        this.cmps = [
            <NavSet/>,
            <SettingsSet/>
        ]

        this.state = {
            cur_cmp: 0
        }

        this.changeCMP = this.changeCMP.bind(this)
    }

    changeCMP(value){
        this.setState(state => ({
            cur_cmp: value
        }))
    }

    render(){
        let cmp = React.cloneElement(this.cmps[this.state.cur_cmp], this.state.cur_cmp==0?
            {
                cur_frame: this.props.cur_frame,
                setCurFrame: this.props.setCurFrame,
                nextFrame: this.props.nextFrame,
                prevFrame: this.props.prevFrame,
                stat_data: this.props.stat_data,
                setRecord: this.props.setRecord,
                setRecordSpeed: this.props.setRecordSpeed,
                refresh: this.props.refresh,
                changeGraph: this.props.changeGraph
            }:
            {
                changeColor: this.props.changeColor,
                colors: this.props.colors
            }    
        )
        return(
            <div className="logNav">
                <div className="nav">
                    <button 
                        className={this.state.cur_cmp==0?"active":""} 
                        onClick={() => {this.changeCMP(0)}}>1
                    </button>
                    <button 
                        className={this.state.cur_cmp==1?"active":""}
                        onClick={() => {this.changeCMP(1)}}>2
                    </button>
                    <button className="analize" onClick={this.props.showAnalize}>
                        Общий анализ
                    </button>
                </div>
                {cmp}
            </div>
        )
    }
}

export default LogNav