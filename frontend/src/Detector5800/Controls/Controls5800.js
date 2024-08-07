import React, {Component} from "react";
import { connect } from 'react-redux';
import "./controls5800.scss";
import refresh from "./img/refresh.png";
import add from "./img/add.png";
import axios from "axios";
import { setCon5800, setStartCon5800, setRec5800 } from "../../AppSlice";
import Console from "../../Console/Console";

class Controls5800 extends Component{
    constructor(props){
        super(props)

        this.state = {
            act_sq: "",
            int: 0,
            act_rec: "",
            ints: [],
            note: "",
            time_count: "000"
        }

        this.comms = [
            "Старт",
            "Конец",
            "Действие",
            "Аномалия",
            "Далеко",
            "Близко",
        ]
        let date = new Date()
        this.rec_name = date.toLocaleDateString() + "_" + date.toLocaleTimeString()

        this.actSq = this.actSq.bind(this)
        this.actRec = this.actRec.bind(this)
        this.getInts = this.getInts.bind(this)
        this.changeInt = this.changeInt.bind(this)
        this.changeRecName = this.changeRecName.bind(this)
        this.changeTimeCount = this.changeTimeCount.bind(this)
        this.changeNote = this.changeNote.bind(this)
        this.addNote = this.addNote.bind(this)
    }

    actSq(){
        let result = ""
        let slice_res = false
        if (this.state.act_sq == ""){
            if (this.props.app.start_config5800.int == ""){
                this.props.updateModal(true, {title:"Ошибка", message:"Не выбран интерфейс"})
            }else{
                result = "active"
                slice_res = true
                this.props.startSq()
            }
        }else{
            if (this.props.app.is_rec5800 == true){
                this.props.updateModal(true, {title:"Ошибка", message:"Нельзя отключить соединение пока активна запись"})
                result = "active"
                slice_res = true
            }else{
                this.props.offSq()
            }
        }
        this.setState(state => ({
            act_sq: result
        }))
        this.props.setCon5800(slice_res)
    }
    changeInt(e){
        if (this.props.app.is_con5800 == true){
            this.props.updateModal(true, {title:"Ошибка", message:"Нельзя изменить интерфейс подключения во время активного соединения"})
        }else{
            this.props.setStartCon5800({
                key: "int",
                value: this.state.ints[e.target.value]
            })
            this.setState(state => ({
                int: e.target.value
            }))
        }
    }
    getInts(){
        let ints = ["Неопределен"]
        axios.get("http://127.0.0.1:8000/getInts").then(response => {
            response.data.ints.forEach(item => {
                ints.push(item)
            })
            this.setState(state => ({
                ints: ints
            }))
        })
    }
    actRec(){
        let result = ""
        let slice_res = false
        if (this.state.act_rec == ""){
            if (this.state.act_sq == ""){
                this.props.updateModal(true, {title: "Ошибка", message: "Нельзя включить запись, не соединив устройство с интерфейсом"})
            }else{
                result = "active"
                slice_res = true
                this.changeTimeCount()
                this.props.actRec(true, "")
            }
        }else{
            clearInterval(this.record_timer)
            this.props.actRec(false, this.rec_name)
        }
        this.setState(state => ({
            act_rec: result
        }))
        this.props.setRec5800(slice_res)
    }
    changeNote(value){
        this.setState(state => ({
            note: value
        }))
    }
    changeRecName(e){
        this.rec_name = e.target.value
    }
    changeTimeCount(){
        this.setState(state => ({
            time_count: "000"
        }), () => {
            this.record_timer = setInterval(() => {
                let time = parseInt(this.state.time_count)+1
                if (time < 10 && time >=0){
                    time = "00"+time
                }if (time < 100 && time >= 10){
                    time = "0"+time
                }
                this.setState(state => ({
                    time_count: time
                }))
            }, 1000)
        })
    }
    componentDidMount(){
        this.getInts()
    }
    addNote(){
        this.props.addNote(this.state.note)
        this.setState(state => ({
            note: ""
        }))
    }

    render(){
        return(
            <div className="controls5800">
                <div className="manage">
                    <div className="title">
                        <button className={"act_sq "+this.state.act_sq} onClick={this.actSq}>
                            <div className={this.state.act_sq}></div>
                        </button>
                        <select className="act_int" onChange={this.changeInt} value={this.state.int}>
                            {this.state.ints.map((item, index) => {
                                return <option value={index} key={index}>{item}</option>
                            })}
                        </select>
                        <button className="act_refresh" onClick={this.getInts}>
                            <img src={refresh} alt="refresh"/>
                        </button>
                    </div>
                    <div className="record">
                        <div className="rec_title">
                            <button className={"act_rec "+this.state.act_rec} onClick={this.actRec}>
                                <div className={this.state.act_rec}></div>
                            </button>
                            <p className="rec_text">Запись</p>
                            <p className="rec_time">{this.state.time_count}</p>
                            <input className="rec_name"
                                type="text"
                                placeholder="Имя записи"
                                onChange={this.changeRecName}
                            />
                        </div>
                        <div className="com_input">
                            <input
                                type="text"
                                placeholder="Заметка"
                                value={this.state.note}
                                onChange={(e) => {this.changeNote(e.target.value)}}
                            />
                            <button className="add" onClick={this.addNote}>
                                <img src={add} alt="add"/>
                            </button>
                        </div>
                        <ul className="com_list">
                            {this.comms.map((item, index) => {
                                return <li key={index} onClick={() => {this.changeNote(item)}}>
                                    <span>{item}</span>
                                </li>
                            })}
                        </ul>
                    </div>
                </div>
                <Console is_big={true}/>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return state;
}
const mapDispatchToProps =  (dispatch) => {
    return {
        "setStartCon5800": (data) => dispatch(setStartCon5800(data)),
        "setCon5800": (data) => dispatch(setCon5800(data)),
        "setRec5800": (data) => dispatch(setRec5800(data)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Controls5800)