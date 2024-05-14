import React, {Component} from "react";
import "./logReaderSM.css";
import LogLoad from "../LogReader/LogLoad/LogLoad";
import axios from "axios";
import LogPlayerSmall from "./LogPlayerSmall/LogPlayerSmall";

class LogReaderSmall extends Component{
    constructor(props){
        super(props)

        this.state = {
            log_data: null
        }

        this.refresh = this.refresh.bind(this)
        this.fileSelectMulti = this.fileSelectMulti.bind(this)
    }

    fileSelectMulti(e){
        if (e.target.files.length !== 2){
            this.props.updateModal(true, {title: "Ошибка", message: "Выберите 2 файла"})
        }else{
            let data = new FormData
            data.append("file_1", new Blob([e.target.files[0]]))
            data.append("file_2", new Blob([e.target.files[1]]))
            axios.post("http://127.0.0.1:8000/getLogDataMult", data).then(response => {
                if (response.data.result == false){
                    this.props.updateModal(true, {title: "Ошибка открытия логов", message: "При открытии логов произошла ошибка"})
                }else{
                    console.log(response.data) 
                    this.setState({
                        log_data: {
                            data_1: response.data.res_1.log_data,
                            data_2: response.data.res_2.log_data,
                            file_name_1: e.target.files[0].name,
                            file_name_2: e.target.files[1].name,
                            log_type_1: response.data.res_1.type,
                            log_type_2: response.data.res_2.type,
                        }
                    })
                }
            })
        }
    }

    refresh(){
        this.setState(state => ({
            log_data: null
        }))
    }

    render(){
        return(
            <div className="logReader">
                {(this.state.log_data==null)?
                    <div className="load">
                        <LogLoad
                            fileSelect={this.fileSelectMulti}
                            title={"Выберите несколько файлов"}
                            type="multi"
                        />
                    </div>:
                    <div className="mult_player">
                        <LogPlayerSmall
                            log_data={this.state.log_data.data_1}
                            file_name={this.state.log_data.file_name_1}
                            refresh={this.refresh}
                            updateModal={this.props.updateModal}
                            log_type={this.state.log_data.log_type_1}
                            is_first={true}
                        />
                        <LogPlayerSmall
                            log_data={this.state.log_data.data_2}
                            file_name={this.state.log_data.file_name_2}
                            refresh={this.refresh}
                            updateModal={this.props.updateModal}
                            log_type={this.state.log_data.log_type_2}
                            is_first={false}
                        />
                    </div>
                }
            </div>
        )
    }
}

export default LogReaderSmall