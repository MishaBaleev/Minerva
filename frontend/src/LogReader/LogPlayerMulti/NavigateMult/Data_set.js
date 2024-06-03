import React, {Component} from "react";
import DataSetGraph from "./DataSetGraph";

class Data_set extends Component{
    constructor(props){
        super(props)
    }

    render(){
        console.log(this.props.cur_arrs)
        return <div className="data_mult">
            <DataSetGraph
                title="Количество ненулевых частот 820-920 МГц"
                data={this.props.cur_arrs.notNullCount915}
                xTicks={this.props.cur_arrs.notNullCount915.map((_, index) => {return index + 1})}
            />
            <DataSetGraph
                title="Среднее значение ненулевых частот 820-920 МГц"
                data={this.props.cur_arrs.avNotNull915}
                xTicks={this.props.cur_arrs.avNotNull915.map((_, index) => {return index + 1})}
            />
            <DataSetGraph
                title="Количество ненулевых частот 2400-2485 МГц"
                data={this.props.cur_arrs.notNullCount2400}
                xTicks={this.props.cur_arrs.notNullCount2400.map((_, index) => {return index + 1})}
            />
            <DataSetGraph
                title="Количество ненулевых частот 820-920 МГц"
                data={this.props.cur_arrs.avNotNull2400}
                xTicks={this.props.cur_arrs.avNotNull2400.map((_, index) => {return index + 1})}
            />
        </div>
    }
}

export default Data_set