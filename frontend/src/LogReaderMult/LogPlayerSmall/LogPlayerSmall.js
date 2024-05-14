import React, {Component} from "react";
import "./logPlayerSmall.css";
import LogGraphSM from "./LogGraphSM/LogGraphSM";
import LogGraphNormSM from "./LogGraphNormSM/LogGraphNormSM";
import LogNavSM from "./LogNavSM/LogNavSM";

class LogPlayerSmall extends Component{
    constructor(props){
        super(props)
        this.stat_data = {
            start_time: this.props.log_data[0].time,
            end_time: this.props.log_data[this.props.log_data.length-1].time,
            length: this.props.log_data.length
        }
        this.is_record = false
        this.record_speed = 1

        if (this.props.log_type==2.4){
            this.state = {
                cur_frame: this.props.log_data[0],
                zone_state: JSON.parse(this.props.log_data[0].zone_state),
                colors: {
                    graph: "#00ff00",
                    warning: "#ffff00",
                    help_line: "#ff0000"
                },
                graph_zone: [],
                graph_view: 0
            }
        }else{
            this.state = {
                cur_frame: this.props.log_data[0],
                graph_view: 0,
                colors: {
                    graph: "#00ff00",
                    warning: "#ffff00",
                    help_line: "#ff0000"
                },
            }
        }

        this.setCurFrame = this.setCurFrame.bind(this)
        this.nextFrame = this.nextFrame.bind(this)
        this.prevFrame = this.prevFrame.bind(this)
        this.playRecord = this.playRecord.bind(this)
        this.setRecord = this.setRecord.bind(this)
        this.setRecordSpeed = this.setRecordSpeed.bind(this)
        this.changeColor = this.changeColor.bind(this)
        this.changeGraph = this.changeGraph.bind(this)
    }

    nextFrame(){
        let cur_id = this.state.cur_frame.id-1
        if (cur_id + 1 < this.stat_data.length){
            this.setCurFrame(cur_id+1)
        }
    }
    prevFrame(){
        let cur_id = this.state.cur_frame.id-1
        if (cur_id - 1 > -1){
            this.setCurFrame(cur_id-1)
        }
    }

    setCurFrame(index){
        if (this.props.log_type==2.4){
            this.setState(state => ({
                cur_frame: this.props.log_data[index],
                zone_state: JSON.parse(this.props.log_data[index].zone_state)
            }))
        }else if(this.props.log_type==443){
            this.setState(state => ({
                cur_frame: this.props.log_data[index]
            }))
        }
    }

    setRecord(value){
        this.is_record = value
    }

    playRecord(){
        if (this.is_record == true){
            this.nextFrame()
        }
        setTimeout(this.playRecord, 1000/this.record_speed)
    }
    setRecordSpeed(value){
        this.record_speed = value
    }

    changeColor(key, value){
        let colors = this.state.colors
        colors[key] = value
        this.setState(state => ({
            colors: colors
        }))
    }

    changeGraph(value){
        this.setState(state => ({
            graph_view: value
        }))
    }

    componentDidMount(){
        this.playRecord()
    }

    render(){
        return <div className="lp_small">
            {this.state.graph_view==0?
                <LogGraphSM
                    cur_frame={this.state.cur_frame}
                    freq_arr={JSON.parse(this.state.cur_frame.freq_arr)}
                    colors={this.state.colors}
                    graph_zone={this.state.graph_zone}
                    log_type={this.props.log_type}
                />:
                <LogGraphNormSM
                    cur_frame={this.state.cur_frame}
                    colors={this.state.colors}
                />
            }
            <LogNavSM
                setCurFrame={this.setCurFrame}
                nextFrame={this.nextFrame}
                prevFrame={this.prevFrame}
                cur_frame={this.state.cur_frame}
                stat_data={this.stat_data}
                setRecord={this.setRecord}
                setRecordSpeed={this.setRecordSpeed}
                refresh={this.props.refresh}
                changeColor={this.changeColor}
                colors={this.state.colors}
                changeGraph={this.changeGraph}
                showAnalize={this.showAnalize}
                log_type={this.props.log_type}
                is_first={this.props.is_first}
            />
        </div>
    }
}

export default LogPlayerSmall