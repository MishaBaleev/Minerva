import React, {Component} from "react";
import "./colView443.css";
import { HuePicker } from 'react-color';

class ColView443 extends Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div className="col_view443">
                <p className="title">Цветовые обозначения</p>
                <div className="col_it">
                    <p>Основной график</p>
                    <div className="change">
                        <div className="col_ex" style={{backgroundColor: this.props.gr_colors.graph}}></div>
                        <HuePicker
                            color={this.props.gr_colors.graph}
                            onChange={(e) => {this.props.changeColors("graph", e.hex)}}
                        />
                    </div>
                </div>
                <div className="block"></div>
                <div className="col_it">
                    <p>Отображение аномалий</p>
                    <div className="change">
                        <div className="col_ex" style={{backgroundColor: this.props.gr_colors.warning}}></div>
                        <HuePicker
                            color={this.props.gr_colors.warning}
                            onChange={(e) => {this.props.changeColors("warning", e.hex)}}
                        />
                    </div>
                </div>
                <div className="block"></div>
                <div className="col_it">
                    <p>Отображение вспомогательных линий</p>
                    <div className="change">
                        <div className="col_ex" style={{backgroundColor: this.props.gr_colors.help_line}}></div>
                        <HuePicker
                            color={this.props.gr_colors.help_line}
                            onChange={(e) => {this.props.changeColors("help_line", e.hex)}}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default ColView443