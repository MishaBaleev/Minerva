import React, {Component} from "react";
import "./App.css";
import "@fontsource/jetbrains-mono";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/400-italic.css";
import axios from "axios";
import { Chart } from "chart.js/auto";
import { connect } from 'react-redux';
import Header from "./Header/Header";
import Detector from "./Detector/Detector";
import LogReader from "./LogReader/LogReader";
import annotationPlugin from 'chartjs-plugin-annotation';
import Loading from "./Loading/Loading";
import Modal from "./Modal/Modal";
import Detector433 from "./Detector433/Detector433";
import DetectorMulti from "./DetectorMulti/DetectorMulti";
import Detector5800 from "./Detector5800/Detector5800";

class App extends Component{
  constructor(props){
    super(props)
    this.cmps = [
      <Detector5800/>,
      <DetectorMulti/>,
      <Detector433/>,
      <Detector/>,
      <LogReader/>
    ]

    this.state = {
      active_cmp: localStorage.getItem("cur_cmp")!=null?localStorage.getItem("cur_cmp"):0,
      is_int_ready: false,
      is_mod_act: false,
      mod_data: {}
    }

    this.changeCMP = this.changeCMP.bind(this)
    this.updateModal = this.updateModal.bind(this)
  }

  changeCMP(value){
    if (this.props.app.is_con == true || this.props.app.is_con433 == true){
      this.updateModal(true, {title:"Ошибка", message:"Отключите устройство"})
    }else{
      this.setState(stet => ({
        active_cmp: value
      }))

      localStorage.setItem("cur_cmp", value)
    }
  }

  checkBack(){
    axios.get("http://127.0.0.1:8000/checkBack").then(response => {
        this.setState(state => ({
          is_int_ready: true
        }))
    }).catch(() => {
      setTimeout(() => {this.checkBack()}, 1000)
    })
  }

  updateModal(is_act, data){
    if (is_act == true){
      this.setState(state => ({
        is_mod_act: true,
        mod_data: data
      }))
    }else{
      this.setState(state => ({
        is_mod_act: false
      }))
    }
  }

  componentDidMount(){
    Chart.register(annotationPlugin)
    this.checkBack()
  }
  
  render(){
    let cur_cmp = React.cloneElement(this.cmps[this.state.active_cmp], {
      updateModal:this.updateModal
    })
    return(
      <div className="app">
        {this.state.is_int_ready==true?
          <div className="container">
            <Header
              active_cmp={this.state.active_cmp}
              changeCMP={this.changeCMP}
            />
            {cur_cmp}
            {this.state.is_mod_act==true?<Modal title={this.state.mod_data.title} message={this.state.mod_data.message} updateModal={this.updateModal}/>:""}
          </div>:<Loading/>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return state;
}
const mapDispatchToProps =  (dispatch) => {
  return {
    // "setTest": (data) => dispatch(setTest(data))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(App)