import React, {Component} from "react";
import "./logAnalize.css";
import GraphA from "./GraphA/GraphA";
import axios from "axios";

class LogAnalize extends Component{
    constructor(props){
        super(props)

        this.state = {
            start_data: {
                start_frame: 1,
                end_frame: this.props.length,
                rssi: 0
            },
            data_915: {
                activity_data: [],
                max_data: [],
                time_data: [],
                av_rssi_data: [],
                under_rssi_data: []
            }
        }

        this.changeStartData = this.changeStartData.bind(this)
        this.analize915 = this.analize915.bind(this)
        this.writeAn915 = this.writeAn915.bind(this)
    }

    changeStartData(key, value){
        let start_data = this.state.start_data
        start_data[key] = value 
        this.setState(state => ({
            start_data: start_data
        }))
    }

    analize915(){
        let time_arr = []
        let activity_arr = []
        let max_arr = []
        let av_rssi_arr = []
        let under_rssi = []
        this.props.data.forEach((item, index) => {
            if (index >= this.state.start_data.start_frame-1 && index <= this.state.start_data.end_frame){
                let start_time = this.props.data[0].time
                time_arr.push('('+index+') '+Math.round((item.time-start_time)*100)/100)

                let counter = 0
                JSON.parse(item.freq_arr).forEach(item_ => {
                    if (item_>0){counter++}
                })
                activity_arr.push(counter)

                max_arr.push(Math.max.apply(null, JSON.parse(item.freq_arr)))

                let summ = 0 
                counter = 0
                JSON.parse(item.freq_arr).forEach(item_ => {
                    if (item_ > 0){
                        summ += item_ 
                        counter++
                    }
                })
                if (counter > 0){
                    av_rssi_arr.push(summ/counter)
                }else{
                    av_rssi_arr.push(0)
                }

                counter = 0
                JSON.parse(item.freq_arr).forEach(item_ => {
                    if (item_ > this.state.start_data.rssi){counter++}
                })
                under_rssi.push(counter)
            }
        })
        this.setState({
            data_915: {
                activity_data: activity_arr,
                max_data: max_arr,
                time_data: time_arr,
                av_rssi_data: av_rssi_arr,
                under_rssi_data: under_rssi
            }
        })
    }
    writeAn915(){
        if (this.state.data_915.time_data.length == 0){
            this.props.updateModal(true, {title:"Ошибка", message:"Сначала проведите анализ"})
        }else{
            let data = new FormData
            data.append("data", JSON.stringify({
                activity_data: this.state.data_915.activity_data,
                max_data: this.state.data_915.max_data,
                time_data: this.state.data_915.time_data,
                av_rssi_data: this.state.data_915.av_rssi_data,
                under_rssi_data: this.state.data_915.under_rssi_data,
                rssi_level: this.state.start_data.rssi
            }))
            data.append("file_name", this.props.file_name)
            axios.post("http://127.0.0.1:8000/analizeLog915", data).then(response => {
                this.props.updateModal(true, {title:"Сохранено", message:"Файл сохранен в директорию /reports"})
            })
        }
    }

    render(){
        return(
            <div className="logAnalize">
                <div className="back"></div>
                <div className="main_wind">
                    <button className="close" onClick={this.props.showAnalize}></button>
                    <p className="main_title">Итоговый анализ</p>
                    <div className="range">
                        <div className="item time">
                            <p className="title">Номер начального пакета</p>
                            <input className="range_line"
                                type="range"
                                min={1}
                                max={this.props.length}
                                value={this.state.start_data.start_frame}
                                onChange={(e) => {this.changeStartData("start_frame", e.target.value)}}
                            />
                            <input className="number"
                                type="number"
                                min={1}
                                max={this.props.length}
                                value={this.state.start_data.start_frame}
                                onChange={(e) => {this.changeStartData("start_frame", e.target.value)}}
                            />
                        </div>
                        <div className="block time"></div>
                        <div className="item time">
                            <p className="title">Номер конечного пакета</p>
                            <input className="range_line"
                                type="range"
                                min={1}
                                max={this.props.length}
                                value={this.state.start_data.end_frame}
                                onChange={(e) => {this.changeStartData("end_frame", e.target.value)}}
                            />
                            <input className="number"
                                type="number"
                                min={1}
                                max={this.props.length}
                                value={this.state.start_data.end_frame}
                                onChange={(e) => {this.changeStartData("end_frame", e.target.value)}}
                            />
                        </div>
                        <div className="item">
                            <p className="title">Уровень RSSI</p>
                            <input className="range_line"
                                type="range"
                                min={0}
                                max={100}
                                value={this.state.start_data.rssi}
                                onChange={(e) => {this.changeStartData("rssi", e.target.value)}}
                            />
                            <input className="number"
                                type="number"
                                min={0}
                                max={100}
                                value={this.state.start_data.rssi}
                                onChange={(e) => {this.changeStartData("rssi", e.target.value)}}
                            />
                        </div>
                    </div>
                    <button className="start_an" onClick={this.analize915}>Провести анализ</button>
                    <div className="graphs">
                        <GraphA
                            title="Изменение количества ненулевых частот"
                            time={this.state.data_915.time_data}
                            data={this.state.data_915.activity_data}
                            is_av={true}
                        />
                        <GraphA
                            title="Изменение максимального значения частот"
                            time={this.state.data_915.time_data}
                            data={this.state.data_915.max_data}
                            is_av={true}
                        />
                        <GraphA
                            title="Изменение среднего значения ненулевых частот"
                            time={this.state.data_915.time_data}
                            data={this.state.data_915.av_rssi_data}
                            is_av={true}
                        />
                        <GraphA
                            title="Изменение количества частот, превышающих уровень RSSI"
                            time={this.state.data_915.time_data}
                            data={this.state.data_915.under_rssi_data}
                            is_av={true}
                        />
                        <button className="write_an" onClick={this.writeAn915}>Сохранить анализ</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default LogAnalize