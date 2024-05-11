import React, {Component} from "react";
import './channelActivity.css';
import {Line} from "react-chartjs-2";

class ChannelActivity extends Component{
    constructor(props){
        super(props)

        this.state = {
            active: "non_active"
        }

        this.changeActive = this.changeActive.bind(this)
    }

    changeActive(){
        if (this.state.active=="non_active"){
            this.setState(state => ({
                active: ""
            }))
        }else{
            this.setState(state => ({
                active: "non_active"
            }))
        }
    }

    render(){
        let data = {
            labels: this.props.data.map((item, index) => {return (index+1)}),
            color: "whitesmoke",
            datasets: [{
                data: this.props.data,
                label: "",
                borderColor: "#00ff00",
                fill: true,
                lineTension: 0.5
            }]
        }
        let options = {
            plugins: {
                legend: {
                    display: false
                }
            },
            scales:{
                y:{
                    grid:{
                        color: "whiteSmoke"
                    },
                    ticks:{
                        color: "whitesmoke"
                    }
                },
                x:{
                    grid:{
                        color: "whitesmoke"
                    },
                    ticks:{
                        color: "whitesmoke"
                    }
                }
            }
        }
        return(
            <div className="chan_activ_graph">
                <h2 className="title_graph" onClick={this.changeActive}>
                    Канал № {this.props.channel} ({this.props.center}) загружен - {this.props.value}/22
                </h2>
                <div className={"graph "+this.state.active}>
                    <Line
                        type="line"
                        data={data} 
                        options={options}
                    />
                </div>
            </div>
        )
    }
}

export default ChannelActivity