import React, {Component} from "react";
import "./detectorSet.scss";
import show from "./img/show.png";

class DetectorSet extends Component{
    constructor(props){
        super(props)

        this.propsstate = {
            act_an: ""
        }

        this.anom_types = ["Не определено", "Mavic - пульт", "Mavic - wi-fi", "wi-fi download", "wi-fi upload"]

        this.changeCritLev = this.changeCritLev.bind(this)
    }

    changeCritLev(e){
        this.props.changeCritLev(e.target.value)
    }

    render(){
        console.log(this.props)
        return(
            <div className="detect_set">
                <div className="analize">
                    <div className="title">
                        <button className={"act_an "+this.props.act_an} onClick={this.props.actAn}>
                            <div className={this.props.act_an}></div>
                        </button>
                        <p>Анализ</p>
                    </div>
                    <div className="crit_level">
                        <input className="range"
                            type="range"
                            value={this.props.crit_level}
                            min={0}
                            max={50}
                            step={0.5}
                            onChange={this.changeCritLev}
                        />
                        <input className="number"
                            type="number"
                            value={this.props.crit_level}
                            min={0}
                            max={50}
                            step={0.5}
                            onChange={this.changeCritLev}
                        />
                        <p>Уровень обнаружения</p>
                    </div>
                </div>
                <div className="block"></div>
                <div className="zone_state">
                    <p className="title">Обнаружение аномалий</p>
                    <p className={"result col_"+this.props.zone_state}>
                        {this.props.zone_state==0?"Не определено":(this.props.zone_state==1?"Аномалия":"Аномалии не обнаружены")}
                    </p>
                    <p className="anom">
                        Автоматический анализ<br/>{this.anom_types[this.props.anom_type]}
                    </p>
                </div>
                <div className="block"></div>
                <div className="temp">
                    <p className="title">Темпоральный анализ (Обновлено: {this.props.temp_time})</p>
                    <ul className="temp_list">
                        {this.props.temp_results.map((item, index) => {
                            return <li key={index}>
                                {index+1}. Пик - [{item[0]}, {item[1]}] 
                                <button className="show" onClick={() => {this.props.showTempResult(item[0], item[1])}}>
                                    <img src={show} alt="show"/>
                                </button>
                            </li>
                        })}
                    </ul>
                </div>
            </div>
        )
    }
}

export default DetectorSet