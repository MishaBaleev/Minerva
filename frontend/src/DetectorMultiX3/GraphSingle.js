import {Bar} from "react-chartjs-2";

const GraphSingle = (props) => {
    let data = {
        labels: props.xticks,
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
                suggestedMin: props.min, suggestedMax: props.max,
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
    return <div className="graph_single">
        <p className="name">{props.name}</p>
        <div className="bar_multiX3">
            <Bar 
                type="Bar"
                options={options}
                data={data}
            />
        </div>
    </div>
}

export default GraphSingle