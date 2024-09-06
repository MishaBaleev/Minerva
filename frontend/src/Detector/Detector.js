import React, {Component} from "react";
import "./detector.css";
import Graph from "./Graph/Graph";
import { connect } from 'react-redux';
import Controls from "./Controls/Controls";
import Settings from "./Settings/Settings";
import { setStartCon } from "../AppSlice";
import NormGraph from "./NormGraph/NormGraph";

class Detector extends Component{
    constructor(props){
        super(props)

        this.socket = new WebSocket("ws://127.0.0.1:8000/con_2400")

        this.hide_temp = null
        this.is_alg_test = false

        this.state = {
            freq_arr: Array(82).fill(0),
            norm_freq_arr: Array(82).fill(0),
            crit_level: 20,
            gr_colors: {
                graph: "#00ff00",
                warning: "#ffff00",
                help_line: "#ff0000"
            },
            zone_state: {
                type: 0,
                targets: [],
                anom_type: 0
            },
            temp_block: [],
            temp_results: [],
            temp_time: "--",
            graph_view: 0,
            alg_test_res: {
                all: 0,
                warning: 0,
                safe: 0,
                all_arr: [],
                warning_arr: [],
                safe_arr: []
            },
            raw_data: []
        }

        this.startSq = this.startSq.bind(this)
        this.offSq = this.offSq.bind(this)
        this.socOnMes = this.socOnMes.bind(this)
        this.changeCritLev = this.changeCritLev.bind(this)
        this.changeColors = this.changeColors.bind(this)
        this.actDetect = this.actDetect.bind(this)
        this.actRec = this.actRec.bind(this)
        this.addNote = this.addNote.bind(this)
        this.showTempResult = this.showTempResult.bind(this)
        this.changeGraphView = this.changeGraphView.bind(this)
        this.algTestStart = this.algTestStart.bind(this)
        this.algTestRes = this.algTestRes.bind(this)
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
            cur_state.norm_freq_arr = data.norm_frame
            cur_state.zone_state = data.zone_state
            cur_state.temp_results = data.zone_state.temp_results==null?this.state.temp_results:data.zone_state.temp_results
            cur_state.temp_time = data.zone_state.temp_results==null?this.state.temp_time:new Date().toLocaleTimeString()
            let raw_data_arr = [...cur_state.raw_data]
            raw_data_arr.push({
                data: data.raw_data,
                time: this.getTime()
            })
            cur_state.raw_data = raw_data_arr
            if (this.is_alg_test == true){
                cur_state.alg_test_res = {...this.algTestRes(data.zone_state)}
            }
            this.setState(state => ({
                ...cur_state
            }))
        }
    }

    startSq(){
        let data = {
            type: 2400,
            command: "start",
            start_config: this.props.app.start_config
        }
        this.socket.send(JSON.stringify(data))
        this.socket.onmessage = this.socOnMes
    }
    offSq(){
        let data = {
            type: 2400,
            command: "off"
        }
        this.socket.send(JSON.stringify(data))
    }

    changeCritLev(value){
        this.setState(state => ({
            crit_level: value
        }))
        this.props.setStartCon({key: "crit_level", value: value})
        if (this.props.app.is_con){
            let data = {
                type: 2400,
                command: "crit_level",
                value: value
            }
            this.socket.send(JSON.stringify(data))
        }
    }

    changeColors(color, value){
        let colors = this.state.gr_colors
        colors[color] = value
        this.setState(state => ({
            gr_colors: colors
        }))
    }

    actDetect(value){
        let data = {
            type: 2400,
            command: "change_detect",
            value: value
        }
        this.socket.send(JSON.stringify(data))
    }

    actRec(value, file_name){
        let data = {
            type: 2400,
            command: "act_rec",
            value: value,
            file_name: file_name
        }
        this.socket.send(JSON.stringify(data))
    }

    addNote(value){
        if (this.props.app.is_rec == true){
            let data = {
                type: 2400,
                command: "add_note",
                value: value
            }
            this.socket.send(JSON.stringify(data))
        }else{
            this.props.updateModal(true, {title:"Ошибка", message:"Нельзя прикрепить комментарий без активной записи"})
        }
    }

    showTempResult(start, end){
        this.setState(state => ({
            temp_block: [start, end]
        }), () => {
            clearTimeout(this.hide_temp)
            this.hide_temp = setTimeout(() => {
                this.setState(state => ({
                    temp_block: []
                }))
            }, 5000)
        })
    }

    changeGraphView(value){
        this.setState(state => ({
            graph_view: value
        }))
    }

    algTestStart(value){
        this.is_alg_test = value
        if (value == true){
            this.setState(state => ({
                alg_test_res: {
                    all: 0,
                    warning: 0,
                    safe: 0,
                    all_arr: [],
                    warning_arr: [],
                    safe_arr: []
                }
            }))
        }
    }
    algTestRes(zone_state){
        let alg_res = this.state.alg_test_res
        if (zone_state.type == 1){
            alg_res.warning += 1
        }
        if (zone_state.type == 2){
            alg_res.safe += 1
        }
        alg_res.all += 1
        alg_res.all_arr.push(alg_res.all)
        alg_res.warning_arr.push(alg_res.warning)
        alg_res.safe_arr.push(alg_res.safe)
        return alg_res
    }

    componentWillUnmount(){
        this.props.setStartCon({
            key: "int",
            value: ""
        })
        this.props.setStartCon({
            key: "crit_level",
            value: 20
        })
        this.props.setStartCon({
            key: "is_detect_act",
            value: false
        })
    }

    render(){
        return(
            <div className="detector">
                {this.state.graph_view==0?
                    <Graph 
                        freq_arr={this.state.freq_arr}
                        crit_level={this.state.crit_level}
                        gr_colors={this.state.gr_colors}
                        targets={this.state.zone_state.targets}
                        temp_block={this.state.temp_block}
                    />:
                    <NormGraph
                        freq_arr={this.state.norm_freq_arr}
                        gr_colors={this.state.gr_colors}
                    />
                }
                <Controls 
                    updateModal={this.props.updateModal} 
                    startSq={this.startSq}
                    offSq={this.offSq}
                    actRec={this.actRec}
                    addNote={this.addNote}
                    changeGraphView={this.changeGraphView}
                    console_data={this.state.raw_data}
                />  
                <Settings
                    changeCritLev={this.changeCritLev}
                    gr_colors={this.state.gr_colors}
                    changeColors={this.changeColors}
                    actDetect={this.actDetect}
                    updateModal={this.props.updateModal}
                    zone_state={this.state.zone_state.type}
                    temp_results={this.state.temp_results}
                    anom_type={this.state.zone_state.anom_type}
                    temp_time={this.state.temp_time}
                    showTempResult={this.showTempResult}
                    alg_test_res={this.state.alg_test_res}
                    algTestStart={this.algTestStart}
                    is_alg_test={this.is_alg_test}
                    crit_level={this.state.crit_level}
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
        "setStartCon": (data) => dispatch(setStartCon(data)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Detector)