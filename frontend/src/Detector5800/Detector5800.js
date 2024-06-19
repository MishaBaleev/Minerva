import React, {Component} from "react";
import "./detector5800.css";
import { connect } from 'react-redux';
import Controls5800 from "./Controls/Controls5800";
import Settings5800 from "./Settings5800/Settings5800";
import DetGraph5800 from "./DetGraph5800/DetGraph5800";
import { setStartCon5800 } from "../AppSlice";

class Detector5800 extends Component{
    constructor(props){
        super(props)

        this.socket = new WebSocket("ws://127.0.0.1:8000/con_5800")
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
            update_time: "00:00:00"
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
            type: 5800,
            command: "start",
            start_config: this.props.app.start_config5800
        }
        this.socket.send(JSON.stringify(data))
        this.socket.onmessage = this.socOnMes
    }
    socOnMes(e){
        let data = JSON.parse(e.data)
        console.log(data)
        let cur_state = {...this.state}
        cur_state.freq_arr = data.frame
        cur_state.update_time = this.getUpdateTime()
        cur_state.zone_state = data.zone_state
        this.setState(state => ({
            ...cur_state
        }))
    }
    offSq(){
        let data = {
            type: 5800,
            command: "off"
        }
        this.socket.send(JSON.stringify(data))
    }
    actRec(value, file_name){
        let data = {
            type: 5800,
            command: "act_rec",
            value: value,
            file_name: file_name
        }
        this.socket.send(JSON.stringify(data))
    }
    addNote(value){
        if (this.props.app.is_rec5800 == true){
            let data = {
                type: 5800,
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
        // pass
    }

    componentWillUnmount(){
        this.props.setStartCon5800({
            key: "int",
            value: ""
        })
    }

    render(){
        return(
            <div className="detector5800">
                <div className="graphs5800">
                    <p className="update">Обновлено в {this.state.update_time}</p>
                    <DetGraph5800
                        xticks={Array(301).fill(0).map((_, index) => {return index+5645})}
                        data={this.state.freq_arr}
                        gr_colors={this.state.gr_colors}
                    />
                </div>
                <Controls5800
                    updateModal={this.props.updateModal}
                    startSq={this.startSq}
                    offSq={this.offSq}
                    actRec={this.actRec}
                    addNote={this.addNote}
                />
                <Settings5800
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
        "setStartCon5800": (data) => dispatch(setStartCon5800)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Detector5800)