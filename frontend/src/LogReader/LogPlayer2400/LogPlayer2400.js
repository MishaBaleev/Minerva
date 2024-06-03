import React, {Component} from "react";
import "./logPlayer2400.css";
import LogData from "./LogData/LogData";
import LogNav from "./LogNav/LogNav";
import LogGraph from "./LogGraph/LogGraph";
import LogGraphNorm from "./LogGraphNorm/LogGraphNorm";
import LogAnalize from "./LogAnalize/LogAnalize";

class LogPlayer2400 extends Component{
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
            zone_state: JSON.parse(this.props.log_data[0].zone_state),
            colors: {
                graph: "#00ff00",
                warning: "#ffff00",
                help_line: "#ff0000"
            },
            cur_arrs: this.getFrameArr(0, this.props.log_type),
            graph_zone: [],
            graph_view: 0,
            is_analize: false
        }

        this.setCurFrame = this.setCurFrame.bind(this)
        this.nextFrame = this.nextFrame.bind(this)
        this.prevFrame = this.prevFrame.bind(this)
        this.playRecord = this.playRecord.bind(this)
        this.setRecord = this.setRecord.bind(this)
        this.setRecordSpeed = this.setRecordSpeed.bind(this)
        this.changeColor = this.changeColor.bind(this)
        this.showZone = this.showZone.bind(this)
        this.changeGraph = this.changeGraph.bind(this)
        this.showAnalize = this.showAnalize.bind(this)
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
            zone_state: JSON.parse(this.props.log_data[index].zone_state),
            cur_arrs: this.getFrameArr(index, this.props.log_type)
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

    getFrameArr(index, log_type){
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
        let crit_level_arr = result_arr.map(item => {return item.crit_level})
        let zone_type_arr = result_arr.map(item => {
            return JSON.parse(item.zone_state).type
        })
        let temp_arr = []
        result_arr.forEach(item => {
            let temp = JSON.parse(item.zone_state).temp_results
            if (temp != null && temp.length != 0){
                temp.forEach(hill => {
                    temp_arr.push({
                        frame_id: item.id,
                        hill: hill
                    })
                })
            }
        })
        return {
            crit_level: crit_level_arr,
            zone_type: zone_type_arr,
            note: note_arr,
            temp: temp_arr,
            frame_arr: result_arr
        } 
    }

    showZone(start, end){
        this.setState(state => ({
            graph_zone: [start, end]
        }), () => {
            clearTimeout(this.hide_temp)
            this.hide_temp = setTimeout(() => {
                this.setState(state => ({
                    graph_zone: []
                }))
            }, 5000)
        })
    }

    changeGraph(value){
        this.setState(state => ({
            graph_view: value
        }))
    }

    showAnalize(){
        if (this.state.is_analize == true){
            this.setState(state => ({
                is_analize: false 
            }))
        }else{
            this.setState(state => ({
                is_analize: true 
            }))
        }
    }

    componentDidMount(){
        this.playRecord()
    }

    render(){
        return(
            <div className="logPlayer">
                <div className="block-1">
                    {this.state.graph_view==0?
                        <LogGraph
                            cur_frame={this.state.cur_frame}
                            freq_arr={JSON.parse(this.state.cur_frame.freq_arr)}
                            colors={this.state.colors}
                            graph_zone={this.state.graph_zone}
                        />:
                        <LogGraphNorm
                            cur_frame={this.state.cur_frame}
                            colors={this.state.colors}
                        />
                    }
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
                    showZone={this.showZone}
                />
                {this.state.is_analize==true?
                    <LogAnalize
                        data={this.props.log_data}
                        showAnalize={this.showAnalize}
                        updateModal={this.props.updateModal}
                        file_name={this.props.file_name}
                        length={this.stat_data.length}
                        log_type={this.props.log_type}
                    />:""
                }
            </div>
        )
    }
}

export default LogPlayer2400