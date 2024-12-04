import React, {Component} from "react";
import "./detectorMulti.scss";
import ControlsMulti from "./ControlsMulti";
import GraphM from "./GraphMult";
import InfoMult from "./InfoMult";
import { connect } from 'react-redux';
import { setStartConMult } from "../AppSlice";

class DetectorMultiX2 extends Component{
    constructor(props){
        super(props)

        this.socket = new WebSocket("ws://127.0.0.1:8000/con_multi")

        this.state = {
            data915: [],
            data2400: [],
            updateTime: "00:00:00",
            raw_data: []
        }

        this.socOnMes = this.socOnMes.bind(this)
        this.startSq = this.startSq.bind(this)
        this.offSq = this.offSq.bind(this)
        this.actRec = this.actRec.bind(this)
        this.addNote = this.addNote.bind(this)
    }

    getUpdateTime(){
        let unform_time = new Date()
        let hours = unform_time.getHours()>=10?unform_time.getHours():("0"+unform_time.getHours())
        let minutes = unform_time.getMinutes()>=10?unform_time.getMinutes():("0"+unform_time.getMinutes())
        let seconds = unform_time.getSeconds()>=10?unform_time.getSeconds():("0"+unform_time.getSeconds())
        return hours+":"+minutes+":"+seconds
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
            let raw_data_arr = [...this.state.raw_data]
            raw_data_arr.push({
                data: data.raw_data,
                time: this.getTime(),
                utc_time: +new Date
            })
            raw_data_arr.sort((a, b) => {return a.utc_time - b.utc_time})
            this.setState({
                data915: data.frame.arr915,
                data2400: data.frame.arr2400,
                updateTime: this.getUpdateTime(),
                raw_data: raw_data_arr.reverse()
            })
            console.log(data)
        }
    }

    startSq(){
        let data = {
            command: "start",
            start_config: this.props.app.start_configMult
        }
        this.socket.send(JSON.stringify(data))
        this.socket.onmessage = this.socOnMes
    }
    offSq(){
        let data = {
            command: "off"
        }
        this.socket.send(JSON.stringify(data))
    }

    actRec(value, file_name){
        let data = {
            command: "act_rec",
            value: value,
            file_name: file_name
        }
        this.socket.send(JSON.stringify(data))
    }
    addNote(value){
        if (this.props.app.is_recMult == true){
            let data = {
                command: "add_note",
                value: value
            }
            this.socket.send(JSON.stringify(data))
        }else{
            this.props.updateModal(true, {title:"Ошибка", message:"Нельзя прикрепить комментарий без активной записи"})
        }
    }

    componentWillUnmount(){
        this.props.setStartConMult({
            key: "int",
            value: ""
        })
    }



    render(){
        return <div className="detMult">
            <ControlsMulti
                updateModal={this.props.updateModal}
                startSq={this.startSq}
                offSq={this.offSq}
                updateTime={this.state.updateTime}
                console_data={this.state.raw_data}
            />
            <div className="graphsM">
                <GraphM
                    title={"915 Мгц"}
                    xTicks={Array(101).fill(0).map((item, index) => {return index+820})}
                    data={this.state.data915}
                    yMax={100}
                />
                <GraphM
                    title={"2.4 ГГц"}
                    xTicks={Array(82).fill(0).map((item, index) => {return index+2401})}
                    data={this.state.data2400}
                    yMax={50}
                />
            </div>
            <InfoMult
                updateModal={this.props.updateModal}
                addNote={this.addNote}
                actRec={this.actRec}
            />
        </div>
    }
}

const mapStateToProps = (state) => {
    return state;
}
const mapDispatchToProps =  (dispatch) => {
    return {
        "setStartConMult": (data) => dispatch(setStartConMult(data)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DetectorMultiX2)