import React, {Component} from "react";
import { connect } from 'react-redux';
import add from "../Detector/Controls/img/add.png";
import { setRecMult } from "../AppSlice";

class InfoMult extends Component{
    constructor(props){
        super(props)

        this.state = {
            note: "",
            act_rec: "",
            timerCount: "000" 
        }

        let date = new Date()
        this.fileName = date.toLocaleDateString() + "_" + date.toLocaleTimeString()

        this.notes = [
            "Начало", "Конец", "Аномалия", "Действие", "Далеко", "Близко"
        ]

        this.changeNote = this.changeNote.bind(this)
        this.addNote = this.addNote.bind(this)
        this.actRec = this.actRec.bind(this)
        this.changeTimeCount = this.changeTimeCount.bind(this)
    }

    changeTimeCount(){
        this.setState(state => ({
            timerCount: "000"
        }), () => {
            this.record_timer = setInterval(() => {
                let time = parseInt(this.state.timerCount)+1
                if (time < 10 && time >=0){
                    time = "00"+time
                }if (time < 100 && time >= 10){
                    time = "0"+time
                }
                this.setState(state => ({
                    timerCount: time
                }))
            }, 1000)
        })
    }

    addNote(){
        this.props.addNote(this.state.note)
        this.changeNote("")
    }

    changeNote(value){
        this.setState({
            note: value
        })
    }

    actRec(){
        if (this.props.app.is_conMult == true){
            if (this.state.act_rec == ""){
                this.setState({
                    act_rec: "active"
                })
                this.changeTimeCount()
                this.props.actRec(true, this.fileName)
                this.props.setRecMult(true)
            }else{
                this.setState({
                    act_rec: ""
                })
                this.props.actRec(false, this.fileName)
                this.props.setRecMult(false)
                clearInterval(this.record_timer)
            }
        }else{
            this.props.updateModal(true, {title: "Ошибка", message: "Нельзя активировать запись, не подключив устройство"})
        }
    }

    render(){
        return <div className="infoM">
            <div className="recM">
                <div className="title">
                    <div className="title">
                        <button className={"act_rec "+this.state.act_rec} onClick={this.actRec}>
                            <div className={this.state.act_rec}></div>
                        </button>
                        <p>Запись {this.state.timerCount}</p>
                        <input
                            type="text"
                            placeholder="Имя записи"
                            onChange={(e) => {this.fileName = e.target.value}}
                        />
                    </div>
                </div>
                <div className="note">
                    <input
                        type="text"
                        placeholder="Заметка"
                        value={this.state.note}
                        onChange={(e) => {this.changeNote(e.target.value)}}
                    />
                    <button className="add" onClick={this.addNote}>
                        <img src={add} alt="add"/>
                    </button>
                    <ul className="noteList">
                        {this.notes.map((item, index) => {
                            return <li key={index} onClick={() => {this.changeNote(item)}}>
                                {item}
                            </li>
                        })}
                    </ul>
                </div>
            </div>
            <div className="block"></div>
            <div className="detM">
                <div className="title">
                        <button className={"act_an "+this.props.act_an} onClick={this.props.actAn}>
                            <div className={this.props.act_an}></div>
                        </button>
                        <p>Анализ</p>
                </div>
                <p className={"result col_"+0}>
                    Не определено
                </p>
            </div>
        </div>
    }
}
const mapStateToProps = (state) => {
    return state;
}
const mapDispatchToProps =  (dispatch) => {
    return {
        "setRecMult": (data) => dispatch(setRecMult(data))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(InfoMult)