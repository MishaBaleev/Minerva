import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { setStartConMultX3 } from "../AppSlice";
import "./detectorCommon.scss";
import ControlsCommon from "./ControlsCommon";
import Monitoring from "./Monitoring/Monitoring";
import Map from "./Map/Map";

const DetectorCommon = (props) => {
    const socket = new WebSocket("ws://127.0.0.1:8000/con_multiX3")
    const [state, setState] = useState({
        freq_arr_915: Array(101).fill(Math.random() * (100 - 0) + 0),
        freq_arr_2400: Array(82).fill(Math.random() * (50 - 0) + 0),
        freq_arr_5800: Array(301).fill(Math.random() * (120 - 0) + 0),
        zone_state: {
            type: 0
        },
        update_time: "00:00:00"
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
            setState({
                freq_arr_915: data.frame.arr915,
                freq_arr_2400: data.frame.arr2400,
                freq_arr_5800: data.frame.arr5800,
                zone_state: data.zone_state,
                update_time: getUpdateTime()
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

    return <div className="det_common">
        <Monitoring

        />
        <div className="anom_type">
            <div className="title">
                <p>Возможная угроза</p>
            </div>
            <div className="description">
                <p><span className="item_name">Название:</span> FPV-дрон</p>
                <p><span className="item_name">Описание:</span> Управляемый оператором на расстоянии летательный аппарат тяжелее воздуха (дрон, беспилотник) с видеокамерой, передающей изображение оператору дрона</p>
            </div>
        </div>
        <ControlsCommon
            updateModal={props.updateModal}
            startSq={startSq}
            offSq={offSq}
            actRec={actRec}
            addNote={addNote}
        />
        <Map
            updateModal={props.updateModal}
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
export default connect(mapStateToProps, mapDispatchToProps)(DetectorCommon)