import React, {Component} from "react";
import "./detector433.css";
import { connect } from 'react-redux';
import Controls433 from "./Controls/Controls433";
import Settings443 from "./Settings443/Settings443";
import DetGraph443 from "./DetGraph433/DetGraph443";
import { setStartCon433 } from "../AppSlice";

class Detector433 extends Component{
    constructor(props){
        super(props)

        this.socket = new WebSocket("ws://127.0.0.1:8000/con_433")
        this.ranges = [[800, 850], [851, 901], [901, 920]]

        this.state = {
            freq_arr: Array(101).fill(0),
            gr_colors: {
                graph: "#00ff00",
                warning: "#ffff00",
                help_line: "#ff0000"
            },
            zone_state: {
                type: 0
            },
            update_time: "00:00:00",
            raw_data: []
        }
        
        this.startSq = this.startSq.bind(this)
        this.offSq = this.offSq.bind(this)
        this.actRec = this.actRec.bind(this)
        this.addNote = this.addNote.bind(this)
        this.socOnMes = this.socOnMes.bind(this)
        this.changeColors = this.changeColors.bind(this)
        this.actDet = this.actDet.bind(this)
    }

    getUpdateTime(){
        let unform_time = new Date()
        let hours = unform_time.getHours()>=10?unform_time.getHours():("0"+unform_time.getHours())
        let minutes = unform_time.getMinutes()>=10?unform_time.getMinutes():("0"+unform_time.getMinutes())
        let seconds = unform_time.getSeconds()>=10?unform_time.getSeconds():("0"+unform_time.getSeconds())
        return hours+":"+minutes+":"+seconds
    }

    startSq(){
        let data = {
            type: 443,
            command: "start",
            start_config: this.props.app.start_config433
        }
        this.socket.send(JSON.stringify(data))
        this.socket.onmessage = this.socOnMes
    }
    getTime(){
        let unform_time = new Date()
        let hours = unform_time.getHours()>=10?unform_time.getHours():("0"+unform_time.getHours())
        let minutes = unform_time.getMinutes()>=10?unform_time.getMinutes():("0"+unform_time.getMinutes())
        let seconds = unform_time.getSeconds()>=10?unform_time.getSeconds():("0"+unform_time.getSeconds())
        return hours+":"+minutes+":"+seconds
    }
    socOnMes(e){
        let data = JSON.parse(e.data)
        if (data.recieve){
            this.props.updateModal(true, {title:"Ошибка", message:data.recieve})
        }else{
            let cur_state = {...this.state}
            cur_state.freq_arr = data.frame
            cur_state.update_time = this.getUpdateTime()
            cur_state.zone_state = data.zone_state
            let raw_data_arr = [...cur_state.raw_data]
            raw_data_arr.push({
                data: data.raw_data,
                time: this.getTime(),
                utc_time: +new Date
            })
            raw_data_arr.sort((a, b) => {return a.utc_time - b.utc_time})
            cur_state.raw_data = raw_data_arr.reverse()
            this.setState(state => ({
                ...cur_state
            }))
        }
    }
    offSq(){
        let data = {
            type: 443,
            command: "off"
        }
        this.socket.send(JSON.stringify(data))
    }
    actRec(value, file_name){
        let data = {
            type: 443,
            command: "act_rec",
            value: value,
            file_name: file_name
        }
        this.socket.send(JSON.stringify(data))
    }
    addNote(value){
        if (this.props.app.is_rec433 == true){
            let data = {
                type: 443,
                command: "add_note",
                value: value
            }
            this.socket.send(JSON.stringify(data))
        }else{
            this.props.updateModal(true, {title:"Ошибка", message:"Нельзя прикрепить комментарий без активной записи"})
        }
    }

    changeColors(key, value){
        let colors = {...this.state.gr_colors}
        colors[key] = value 
        this.setState(state => ({
            gr_colors: colors
        }))
    }

    actDet(value){
        let data = {
            type: 433,
            command: "change_detect",
            value: value
        }
        this.socket.send(JSON.stringify(data))
    }

    componentWillUnmount(){
        this.props.setStartCon433({
            key: "int",
            value: ""
        })
    }

    render(){
        return(
            <div className="detector433">
                <div className="graphs433">
                    <p className="update">Обновлено в {this.state.update_time}</p>
                    <DetGraph443
                        xticks={Array(101).fill(0).map((_, index) => {return index+820})}
                        data={this.state.freq_arr}
                        gr_colors={this.state.gr_colors}
                    />
                </div>
                <Controls433
                    updateModal={this.props.updateModal}
                    startSq={this.startSq}
                    offSq={this.offSq}
                    actRec={this.actRec}
                    addNote={this.addNote}
                    console_data={this.state.raw_data}
                />
                <Settings443
                    gr_colors={this.state.gr_colors}
                    changeColors={this.changeColors}
                    updateModal={this.props.updateModal}
                    actDet={this.actDet}
                    zone_state={this.state.zone_state}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return state;
}
const mapDispatchToProps =  (dispatch) => {
    return {
        "setStartCon433": (data) => dispatch(setStartCon433)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Detector433)