import React, {Component} from "react";
import "./logData.css";
import Graph from "./Graph/Graph";
import show from "../../../Detector/Settings/DetectorSet/img/show.png";

class LogData extends Component{
    constructor(props){
        super(props)

        this.zone_states = [
            "Не определено",
            "Аномалия",
            "Аномалии не обнаружены"
        ]

        this.centers = [2412, 2417, 2422, 2427, 2432, 2437, 2442, 2447, 2452, 2457, 2462, 2467, 2472]
        this.range443 = [[800, 850], [851, 901], [901, 920]]
    
        this.getWorkload = this.getWorkload.bind(this)
    }

    cutFileName(str){
        if (str.length > 20){
            return str.substring(0, 20)+"..."
        }
        else{
            return str
        }
    }

    getWorkload(index, freq_arr){
        let counter = 0
        for (let i = this.centers[index]-2401-11; i < this.centers[index]-2401+11; i++){
            if (Number(JSON.parse(freq_arr)[i]) != 0){
                counter++
            }
        }
        return counter
    }

    getWorkload443(frame){
        let counter = 0
        let js_arr = JSON.parse(frame.freq_arr)
        js_arr.forEach(item => {
            if (item > 0){
                counter++
            }
        })
        return counter
    }

    render(){
        console.log(this.props.cur_frame.zone_state)
        return(
            <div className="logData">
                <p className="file_name">Файл - {this.cutFileName(this.props.file_name)}</p>
                <div className="params">
                    {this.props.log_type==2.4?
                        <div className="block gr">
                            <p className="title gr">Уровень обнаружения ({this.props.cur_frame.crit_level})</p>
                            <Graph
                                data={this.props.cur_arrs.crit_level}
                            />
                        </div>:""
                    }
                    <div className="block">
                        <p className="title">Результаты анализа</p>
                        {this.props.cur_frame.zone_state?
                            <p className={"res _"+JSON.parse(this.props.cur_frame.zone_state).type}>
                                {this.zone_states[JSON.parse(this.props.cur_frame.zone_state).type]}
                            </p>:
                            <p className={"res _0"}>
                                {this.zone_states[0]}
                            </p>
                        }
                        
                    </div>
                    <div className="block">
                        <p className="title">Заметки</p>
                        {this.props.cur_arrs.note.length==0?
                            <p className="text">Заметок нет</p>:
                            <ul className="list"> 
                                {this.props.cur_arrs.note.map((item, index) => {
                                    return <li key={index}>
                                        Пакет № {item.frame_id} - {item.note}
                                    </li>
                                })}
                            </ul>
                        }
                    </div>
                    {this.props.log_type==2.4?
                        <div className="block">
                            <p className="title">Темпоральный анализ</p>
                            {this.props.cur_arrs.temp.length==0?
                                <p className="text">Результатов нет</p>:
                                <ul className="list">
                                    {this.props.cur_arrs.temp.map((item, index) => {
                                        return <li key={index}>
                                            <span>{index+1}) Пакет - {item.frame_id}, зона - [{item.hill[0]}, {item.hill[1]}]</span> 
                                            <button className="show" onClick={() => {this.props.showZone(item.hill[0], item.hill[1])}}>
                                                <img alt="show" src={show}/>
                                            </button>
                                        </li>
                                    })}
                                </ul>
                            }
                        </div>:""
                    }
                    {this.props.log_type==2.4?
                        <div className="block">
                            <p className="title">Распределение активности</p>
                            <ul className="list">
                                {this.centers.map((item, index) => {
                                    return <li key={index}>
                                        Канал № {index+1} ({item}) загружен - {this.getWorkload(index, this.props.cur_frame.freq_arr)}/22
                                    </li>
                                })}
                            </ul>
                        </div>:
                        <div className="block">
                            <p className="title">Распределение активности</p>
                            <ul className="list">
                                <li>
                                    Диапазон 820-920 загружен на {this.getWorkload443(this.props.cur_frame)}/101
                                </li>
                                {/* {this.range443.map((item, index) => {
                                    return <li key={index}>
                                        Диапазон {item[0]}-{item[1]} - загружен на {this.getWorkload443(item)}/{item[1]-item[0]}
                                    </li>
                                })} */}
                            </ul>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default LogData