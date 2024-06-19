import React, {Component} from "react";
import "./logPlayer5800.css";
import LogData from "./LogData/LogData";
import LogNav from "./LogNav/LogNav";
import LogGraph from "./LogGraph/LogGraph"

class LogPlayer5800 extends Component{
    constructor(props){
        super(props)

        this.stat_data = {
            start_time: this.props.log_data[0].time,
            end_time: this.props.log_data[this.props.log_data.length-1].time,
            length: this.props.log_data.length
        }
        this.is_record = false
        this.record_speed = 1
        this.hide_temp = null

        this.state = {
            cur_frame: this.props.log_data[0],
            colors: {
                graph: "#00ff00",
                warning: "#ffff00",
                help_line: "#ff0000"
            },
            cur_arrs: this.getFrameArr(0)
        }

        this.setCurFrame = this.setCurFrame.bind(this)
        this.nextFrame = this.nextFrame.bind(this)
        this.prevFrame = this.prevFrame.bind(this)
        this.playRecord = this.playRecord.bind(this)
        this.setRecord = this.setRecord.bind(this)
        this.setRecordSpeed = this.setRecordSpeed.bind(this)
        this.changeColor = this.changeColor.bind(this)
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
        this.setState(state => ({
            cur_frame: this.props.log_data[index],
            cur_arrs: this.getFrameArr(index)
        }))
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

    getFrameArr(index){
        let result_arr = []
        for (let i = 0; i <= index; i++){
            result_arr.push(this.props.log_data[i])
        }
        let note_arr = []
        result_arr.forEach(item => {
            try{
                if (JSON.parse(item.note).length != 0){
                    JSON.parse(item.note).forEach(item_ => {
                        note_arr.push({
                            note: item_,
                            frame_id: item.id
                        })
                    })
                }
            }catch{
                if (item.note != ""){
                    note_arr.push({
                        note: item.note,
                        frame_id: item.id
                    })
                }
            }
        })
        return {
            note: note_arr,
            frame_arr: result_arr
        }
    }

    componentDidMount(){
        this.playRecord()
    }

    render(){
        return(
            <div className="logPlayer">
                <div className="block-1">
                    <LogGraph
                        cur_frame={this.state.cur_frame}
                        freq_arr={JSON.parse(this.state.cur_frame.freq_arr)}
                        colors={this.state.colors}
                        graph_zone={this.state.graph_zone}
                    />
                    <LogNav
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
                    />
                </div>
                <LogData
                    file_name={this.props.file_name}
                    cur_frame={this.state.cur_frame}
                    cur_arrs={this.state.cur_arrs}
                />
            </div>
        )
    }
}

export default LogPlayer5800