import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";

const RangeCard = (props) => {
    let data = {
        labels: props.data.map((item, _) => {return "!"}),
        color: "whitesmoke",
        datasets: [{
            data: props.data,
            label: "",
            backgroundColor: "#00ff00",
            fill: true
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
                suggestedMin: 0, suggestedMax: props.max,
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
    return <div className="range_card">
        <p className="title">{props.name}</p>
        <div className="range_graph">
            <Bar 
                type="Bar"
                options={options}
                data={data}
            />
        </div>
        <div className="analize good">
            <p>Нет аномалий</p>
        </div>
    </div>
}

export default RangeCard