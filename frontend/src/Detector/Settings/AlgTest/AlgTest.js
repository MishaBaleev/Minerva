import React, {Component} from "react";
import "./algTest.css";
import { connect } from 'react-redux';
import { setTest } from "../../../AppSlice";
import TestGraph from "./TestGraph/TestGraph";

class AlgTest extends Component{
    constructor(props){
        super(props)

        this.state = {
            act_test: this.props.is_alg_test==true?"active":""
        }

        this.actTest = this.actTest.bind(this)
        this.getPercent = this.getPercent.bind(this)
        this.getData = this.getData.bind(this)
    }

    actTest(){
        if (this.state.act_test == "active"){
            this.setState(state => ({
                act_test: ""
            }))
            this.props.setTest(false)
            this.props.algTestStart(false)
        }else{
            if (this.props.app.is_con == false){
                this.props.updateModal(true, {title: "Ошибка", message: "Подключите устройство"})
            }else{
                this.setState(state => ({
                    act_test: "active"
                }))
                this.props.setTest(true)
                this.props.algTestStart(true)
            }
        }
    }

    getPercent(value){
        let result = value/this.props.alg_test_res.all
        return Math.round(result*100)
    }

    getData(key){
        let all_arr = this.props.alg_test_res.all_arr
        if (key == "warning"){
            let result = this.props.alg_test_res.warning_arr.map((item, index) => {
                return item/all_arr[index]
            })
            return result
        }
        if (key == "safe"){
            let result = this.props.alg_test_res.safe_arr.map((item, index) => {
                return item/all_arr[index]
            })
            return result
        }
    }

    render(){
        let warning_per = this.props.alg_test_res.all==0?0:this.getPercent(this.props.alg_test_res.warning)
        let safe_per = this.props.alg_test_res.all==0?0:this.getPercent(this.props.alg_test_res.safe)
        let warning_arr = this.props.alg_test_res.all==0?[]:this.getData("warning")
        let safe_arr = this.props.alg_test_res.all==0?[]:this.getData("safe")
        return(
            <div className="alg_test">
                <div className="main">
                    <div className="title">
                        <button 
                            className={"start "+this.state.act_test}
                            onClick={this.actTest}>
                                <div className={this.state.act_test}></div>
                        </button>
                        <p className="title">Тест точности</p> 
                    </div>
                    <div className="data">
                        <p>Общее количество ситуаций - {this.props.alg_test_res.all}</p>
                        <p>Число срабатываний системы - {this.props.alg_test_res.warning}</p>
                        <p>Число пропусков системы - {this.props.alg_test_res.safe} </p>
                    </div>
                </div>
                <div className="block"></div>
                <div className="res">
                    <p>Процент срабатываний - {warning_per}%</p>
                    <TestGraph
                        data={warning_arr}
                    />
                </div> 
                <div className="block"></div>
                <div className="res">
                    <p>Процент пропусков - {safe_per}%</p>
                    <TestGraph
                        data={safe_arr}
                    />
                </div> 
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return state;
}
const mapDispatchToProps =  (dispatch) => {
    return {
        "setTest": (data) => dispatch(setTest(data))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(AlgTest)