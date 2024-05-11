import React, {Component} from "react";
import "./viewSet.css";
import { HuePicker } from 'react-color';

class ViewSet extends Component{
    constructor(props){
        super(props)

        this.state = {
            gr_colors: {
                graph: this.props.gr_colors.graph,
                warning: this.props.gr_colors.warning,
                help_line: this.props.gr_colors.help_line,
            }
        }
    }

    render(){
        return(
            <div className="view_set">
                <p className="title">Цветовые обозначения</p>
                <div className="col_it">
                    <p>Основной график</p>
                    <div className="change">
                        <div className="col_ex" style={{backgroundColor: this.state.gr_colors.graph}}></div>
                        <HuePicker
                            color={this.props.gr_colors.graph}
                            onChange={(e) => {
                                this.props.changeColors("graph", e.hex)
                                let colors = this.state.gr_colors
                                colors["graph"] = e.hex
                                this.setState(state => ({
                                    gr_colors: colors
                                }))
                            }}
                        />
                    </div>
                </div>
                <div className="block"></div>
                <div className="col_it">
                    <p>Отображение аномалий</p>
                    <div className="change">
                        <div className="col_ex" style={{backgroundColor: this.state.gr_colors.warning}}></div>
                        <HuePicker
                            color={this.props.gr_colors.warning}
                            onChange={(e) => {
                                this.props.changeColors("warning", e.hex)
                                let colors = this.state.gr_colors
                                colors["warning"] = e.hex
                                this.setState(state => ({
                                    gr_colors: colors
                                }))
                            }}
                        />
                    </div>
                </div>
                <div className="block"></div>
                <div className="col_it">
                    <p>Отображение вспомогательных линий</p>
                    <div className="change">
                        <div className="col_ex" style={{backgroundColor: this.state.gr_colors.help_line}}></div>
                        <HuePicker
                            color={this.props.gr_colors.help_line}
                            onChange={(e) => {
                                this.props.changeColors("help_line", e.hex)
                                let colors = this.state.gr_colors
                                colors["help_line"] = e.hex
                                this.setState(state => ({
                                    gr_colors: colors
                                }))
                            }}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default ViewSet