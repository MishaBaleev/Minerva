import React, {Component} from "react";
import "./logData.scss";

class LogData extends Component{
    constructor(props){
        super(props)

        this.zone_states = [
            "Не определено",
            "Аномалия",
            "Аномалии не обнаружены"
        ]
    }

    cutFileName(str){
        if (str.length > 20){
            return str.substring(0, 20)+"..."
        }
        else{
            return str
        }
    }

    getWorkload5800(frame){
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
        return(
            <div className="logData">
                <p className="file_name">Файл - {this.cutFileName(this.props.file_name)}</p>
                <div className="params">
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
                    <div className="block">
                        <p className="title">Распределение активности</p>
                        <ul className="list">
                            <li>
                                Диапазон 5645-5945 загружен на {this.getWorkload5800(this.props.cur_frame)}/301
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export default LogData