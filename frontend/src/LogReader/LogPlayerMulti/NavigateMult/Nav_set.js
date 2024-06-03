import React, {Component} from "react";

class Nav_set extends Component{
    constructor(props){
        super(props)

        this.state = {
            is_play: this.props.is_play,
            record_speed: this.props.record_speed
        }

        this.calcTimeDif = this.calcTimeDif.bind(this)
        this.playPause = this.playPause.bind(this)
        this.changeRecSpeed = this.changeRecSpeed.bind(this)
    }

    secToDate(value){
        let seconds = Number(value)
        let h = Math.floor(seconds % (3600*24) / 3600)+3
        let m = Math.floor(seconds % 3600 / 60)
        let s = Math.floor(seconds % 60)
        return (h<10?("0"+h):h)+":"+(m<10?("0"+m):m)+":"+(s<10?("0"+s):s)
    }

    calcTimeDif(value){
        return (Math.floor(Number(value) - this.props.stat_data.start_time))
    }

    playPause(){
        if (this.state.is_play == "unactive"){
            this.setState(state => ({
                is_play: "active"
            }))
            this.props.setRecord(true)
        }else{
            this.setState(state => ({
                is_play: "unactive"
            }))
            this.props.setRecord(false)
        }
    }

    changeRecSpeed(e){
        this.setState(state => ({
            record_speed: e.target.value
        }))
        this.props.setRecordSpeed(Number(e.target.value))
    }

    render(){
        return <div className="nav_mult">
            <div className="top">
                <div className="buttons">
                    <button className="new single" onClick={this.props.refresh}>Выбрать новый файл</button>
                </div>
                <div>
                    <p className="frame">Пакет № {this.props.cur_frame.id}/{this.props.stat_data.length}</p>
                    <p className="cur_time">Текущее время - {this.secToDate(this.props.cur_frame.time)}</p>
                    <p className="del_time">Время с начала записи - {this.calcTimeDif(this.props.cur_frame.time)} с.</p>
                </div>
            </div>
            <input className="log_line"
                type="range"
                min={0}
                max={this.props.stat_data.length-1}
                value={this.props.cur_frame.id-1}
                step={1}
                onChange={(e) => {this.props.setCurFrame(e.target.value)}}
            />
            <div className="controls">
                <div className="next_prev">
                    <button className="iter prev" onClick={this.props.prevFrame}></button>
                    <button className={"start "+this.state.is_play} onClick={this.playPause}></button>
                    <button className="iter next" onClick={this.props.nextFrame}></button>
                </div>
                <div className="speed">
                    <p className="title">Сорость воспроизведения</p>
                    <div>
                        <input className="range"
                            type="range"
                            min={0.1}
                            max={10}
                            step={0.1}
                            value={this.state.record_speed}
                            onChange={this.changeRecSpeed}
                        />
                        <input className="number"
                            type="number"
                            min={0.1}
                            max={10}
                            step={0.1}
                            value={this.state.record_speed}
                            onChange={this.changeRecSpeed}
                        />
                    </div>
                </div>
            </div>
        </div>
    }
}

export default Nav_set