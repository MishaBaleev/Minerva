import React, {Component} from "react";

class DetSettings extends Component{
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
        return(
            <div className="detSetMultiX3">
                <div className="analize">
                    <div className="title">
                        <button className={"act_an "+this.props.act_an} onClick={this.props.actAn}>
                            <div className={this.props.act_an}></div>
                        </button>
                        <p>Анализ</p>
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
            </div>
        )
    }
}

export default DetSettings