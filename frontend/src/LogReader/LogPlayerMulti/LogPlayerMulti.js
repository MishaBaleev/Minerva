import React, {Component} from "react";
import NavigateMult from "./NavigateMult/NavigateMult";
import GraphMultLR from "./GraphMultLR";
import "./logPlayerMulti.scss";

class LogPlayerMulti extends Component{
    constructor(props){
        super(props)

        this.stat_data = {
            start_time: this.props.log_data[0].time,
            end_time: this.props.log_data[this.props.log_data.length-1].time,
            length: this.props.log_data.length
        }
        this.is_record = false
        this.record_speed = 1

        this.is_play = "unactive"

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
            cur_arrs: this.getFrameArr(index, this.props.log_type)
        }))
    }

    setRecord(value){
        this.is_record = value
        if (value == true){this.is_play = "active"}
        else {this.is_play = "unactive"}
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

    getFrameArr(index){
        let data = this.props.log_data
        let bigArr915 = []
        let bigArr2400 = []
        data.forEach((item, index_) => {
            if (index_ <= index){
                bigArr915.push(JSON.parse(item.freq_arr).arr915)
                bigArr2400.push(JSON.parse(item.freq_arr).arr2400)
            }
        })
        let notNullCount915 = []
        let avNotNull915 = []
        bigArr915.forEach(item => {
            let count = 0 
            let summ = 0
            item.forEach(item_ => {
                if (item_ > 0){
                    count++
                    summ += item_ 
                }
            })
            notNullCount915.push(count)
            avNotNull915.push((count==0)?0:(summ/count))
        })

        let notNullCount2400 = []
        let avNotNull2400 = []
        bigArr2400.forEach(item => {
            let count = 0 
            let summ = 0
            item.forEach(item_ => {
                if (item_ > 0){
                    count++
                    summ += item_ 
                }
            })
            notNullCount2400.push(count)
            avNotNull2400.push((count==0)?0:(summ/count))
        })

        return {
            notNullCount915: notNullCount915,
            notNullCount2400: notNullCount2400,
            avNotNull915: avNotNull915,
            avNotNull2400: avNotNull2400
        }
    }

    componentDidMount(){
        this.playRecord()
    }

    render(){
        let freq_arrs = JSON.parse(this.state.cur_frame.freq_arr)
        return <div className="lp_mult">
            <div className="title">
                <p>Файл - {this.props.file_name}</p> 
            </div>
            <div className="graphs_mult">
                <GraphMultLR
                    title={"915 Мгц"}
                    xTicks={Array(101).fill(0).map((item, index) => {return index+820})}
                    data={freq_arrs.arr915}
                    yMax={100}
                />
                <GraphMultLR
                    title={"2.4 ГГц"}
                    xTicks={Array(82).fill(0).map((item, index) => {return index+2401})}
                    data={freq_arrs.arr2400}
                    yMax={50}
                />
            </div>
            <NavigateMult
                setCurFrame={this.setCurFrame}
                nextFrame={this.nextFrame}
                prevFrame={this.prevFrame}
                cur_frame={this.state.cur_frame}
                stat_data={this.stat_data}
                setRecord={this.setRecord}
                setRecordSpeed={this.setRecordSpeed}
                refresh={this.props.refresh}
                is_play={this.is_play}
                record_speed={this.record_speed}
                cur_arrs={this.state.cur_arrs}
            />
        </div>
    }
}

export default LogPlayerMulti