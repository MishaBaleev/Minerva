import { useState, useEffect } from "react";
import "./detectorMultiX3.scss";
import { connect } from "react-redux";
import { setStartConMultX3 } from "../AppSlice";
import ControlsMultX3 from "./ControlsMultX3";
import GraphMultX3 from "./GraphMultX3";
import SettingsMultiX3 from "./Settings/Settings";

const DetectorMultiX3 = (props) => {
    const socket = new WebSocket("ws://127.0.0.1:8000/con_multiX3")
    const [state, setState] = useState({
        freq_arr_915: Array(101).fill(Math.random() * (100 - 0) + 0),
        freq_arr_2400: Array(82).fill(Math.random() * (50 - 0) + 0),
        freq_arr_5800: Array(301).fill(Math.random() * (120 - 0) + 0),
        zone_state: {
            type: 0
        },
        update_time: "00:00:00",
        raw_data: []
    })
    const getUpdateTime = () => {
        let unform_time = new Date()
        let hours = unform_time.getHours()>=10?unform_time.getHours():("0"+unform_time.getHours())
        let minutes = unform_time.getMinutes()>=10?unform_time.getMinutes():("0"+unform_time.getMinutes())
        let seconds = unform_time.getSeconds()>=10?unform_time.getSeconds():("0"+unform_time.getSeconds())
        return hours+":"+minutes+":"+seconds
    }
    const socOnMes = (e) => {
        let data = JSON.parse(e.data)
        if (data.recieve){
            props.updateModal(true, {title:"Ошибка", message:data.recieve})
        }else{
            let raw_data_arr = [...state.raw_data]
            raw_data_arr.push({
                data: data.raw_data,
                time: this.getTime(),
                utc_time: +new Date
            })
            raw_data_arr.sort((a, b) => {return a.utc_time - b.utc_time})
            setState({
                freq_arr_915: data.frame.arr915,
                freq_arr_2400: data.frame.arr2400,
                freq_arr_5800: data.frame.arr5800,
                zone_state: data.zone_state,
                update_time: getUpdateTime(),
                raw_data: raw_data_arr.reverse()
            })
            console.log(data)
        }
    }

    const startSq = () => {
        let data = {
            command: "start",
            start_config: props.app.start_configMultX3
        }
        socket.send(JSON.stringify(data))
        socket.onmessage = socOnMes
    }
    const offSq = () => {
        let data = {
            command: "off"
        }
        socket.send(JSON.stringify(data))
    }

    const actRec = (value, file_name) => {
        let data = {
            command: "act_rec",
            value: value,
            file_name: file_name
        }
        socket.send(JSON.stringify(data))
    }
    const addNote = (value) => {
        if (props.app.is_recMultX3 == true){
            let data = {
                command: "add_note",
                value: value
            }
            socket.send(JSON.stringify(data))
        }else{
            props.updateModal(true, {title:"Ошибка", message:"Нельзя прикрепить комментарий без активной записи"})
        }
    }

    const actDet = (value) => {
        // pass
    }

    useEffect(() => {
        props.setStartConMultX3({
            key: "int",
            value: ""
        })
    }, [])

    return <div className="mult_x3">
        <GraphMultX3
            freq_arr_2400={state.freq_arr_2400}
            freq_arr_915={state.freq_arr_915}
            freq_arr_5800={state.freq_arr_5800}
        />
        <ControlsMultX3
            updateModal={props.updateModal}
            startSq={startSq}
            offSq={offSq}
            actRec={actRec}
            addNote={addNote}
            console_data={state.raw_data}
        />
        <SettingsMultiX3
            updateModal={props.updateModal}
            actDetect={actDet}
            zone_state={state.zone_state}
        />
    </div>
}

const mapStateToProps = (state) => {
    return state;
}
const mapDispatchToProps =  (dispatch) => {
    return {
        "setStartConMultX3": (data) => dispatch(setStartConMultX3(data)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DetectorMultiX3)