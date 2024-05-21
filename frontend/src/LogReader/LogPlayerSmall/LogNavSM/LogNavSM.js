import React, {Component} from "react";
import "./logNavSM.css";
import NavSetSM from "./NavSetSM/NavSetSM";

class LogNavSM extends Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div className="logNavSM">
                <div className="file_name">
                    <h3>{this.props.file_name}</h3>
                </div>
                <NavSetSM
                    cur_frame={this.props.cur_frame}
                    setCurFrame={this.props.setCurFrame}
                    nextFrame={this.props.nextFrame}
                    prevFrame={this.props.prevFrame}
                    stat_data={this.props.stat_data}
                    setRecord={this.props.setRecord}
                    setRecordSpeed={this.props.setRecordSpeed}
                    refresh={this.props.refresh}
                    changeGraph={this.props.changeGraph}
                    log_type={this.props.log_type}
                    is_first={this.props.is_first}
                />
            </div>
        )
    }
}

export default LogNavSM