import React, {Component} from "react";
import "./settingsSet.css";
import { HuePicker } from 'react-color';

class SettingsSet extends Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div className="settingsSet">
                <p className="title">Цветовые обозначения</p>
                <div className="col_it">
                    <p>График</p>
                    <div className="change">
                        <div className="col_ex" style={{backgroundColor: this.props.colors.graph}}></div>
                        <div className="color">
                            <HuePicker
                                color={this.props.colors.graph}
                                onChange={(e) => {this.props.changeColor("graph", e.hex)}}
                            />
                        </div>
                    </div>
                </div>
                <div className="block"></div>
                <div className="col_it">
                    <p>Аномалии</p>
                    <div className="change">
                        <div className="col_ex" style={{backgroundColor: this.props.colors.warning}}></div>
                        <div className="color">
                            <HuePicker
                                color={this.props.colors.warning}
                                onChange={(e) => {this.props.changeColor("warning", e.hex)}}
                            />
                        </div>
                    </div>
                </div>
                <div className="block"></div>
                <div className="col_it">
                    <p>Вспомогательные линии</p>
                    <div className="change">
                        <div className="col_ex" style={{backgroundColor: this.props.colors.help_line}}></div>
                        <div className="color">
                            <HuePicker
                                color={this.props.colors.help_line}
                                onChange={(e) => {this.props.changeColor("help_line", e.hex)}}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SettingsSet