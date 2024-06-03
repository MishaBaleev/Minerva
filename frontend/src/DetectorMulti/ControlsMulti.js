import React, {Component} from "react";
import { connect } from 'react-redux';
import { setConMult, setStartConMult } from "../AppSlice";
import refresh from "../Detector/Controls/img/refresh.png";
import axios from "axios";

class ControlsMuti extends Component{
    constructor(props){
        super(props)
        this.state = {
            act_sq: "",
            act_rec: "",
            ints: [],
            note: "",
            int: 0
        }

        this.getInts = this.getInts.bind(this)
        this.changeInt = this.changeInt.bind(this)
        this.actSq = this.actSq.bind(this)
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

    changeInt(e){
        if (this.props.app.is_con == true){
            this.props.updateModal(true, {title:"Ошибка", message:"Нельзя изменить интерфейс подключения во время активного соединения"})
        }else{
            this.props.setStartConMult({
                key: "int",
                value: this.state.ints[e.target.value]
            })
            this.setState(state => ({
                int: e.target.value
            }))
        }
    }

    actSq(){
        let result = ""
        let slice_res = false
        if (this.state.act_sq == ""){
            if (this.props.app.start_configMult.int == ""){
                this.props.updateModal(true, {title:"Ошибка", message:"Не выбран интерфейс"})
            }else{
                result = "active"
                slice_res = true
                this.props.startSq()
            }
        }else{
            if (this.props.app.is_recMult == true){
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
        this.props.setConMult(slice_res)
    }

    componentDidMount(){
        this.getInts()
    }

    render(){
        return <div className="controlsM">
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
            <p className="update">Обновлено в {this.props.updateTime}</p>
        </div>
    }
}

const mapStateToProps = (state) => {
    return state;
}
const mapDispatchToProps =  (dispatch) => {
return {
    // "setTest": (data) => dispatch(setTest(data))
    "setStartConMult": (data) => dispatch(setStartConMult(data)),
    "setConMult": (data) => dispatch(setConMult(data))
}
}
export default connect(mapStateToProps, mapDispatchToProps)(ControlsMuti)