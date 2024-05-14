import React, {Component} from "react";
import "./logReader.css";
import LogPlayer from "./LogPlayer/LogPlayer";
import LogLoad from "./LogLoad/LogLoad";
import axios from "axios";

class LogReader extends Component{
    constructor(props){
        super(props)

        this.state = {
            log_data: null,
            file_name: "",
            log_type: null
        }

        this.fileSelect = this.fileSelect.bind(this)
        this.refresh = this.refresh.bind(this)
    }

    fileSelect(e){
        let data = new FormData
        console.log(e.target.files[0])
        data.append("file", new Blob([e.target.files[0]]))
        axios.post("http://127.0.0.1:8000/getLogData", data).then(response => {
            console.log(response)
            if (response.data.result == false){
                this.props.updateModal(true, {title: "Ошибка открытия лога", message: "При открытии лога произошла ошибка"})
            }else{
                if (response.data.type == 2.4){
                    this.setState(state => ({
                        is_mult: false,
                        log_data: response.data.log_data,
                        file_name: e.target.files[0].name,
                        log_type: 2.4
                    }))
                }else if (response.data.type == 443){
                    this.setState(state => ({
                        is_mult: false,
                        log_data: response.data.log_data,
                        file_name: e.target.files[0].name,
                        log_type: 443
                    }))
                }
            }
        })
    }

    refresh(){
        this.setState(state => ({
            log_data: null,
            file_name: "",
            log_type: null,
            is_mult: false,
            log_data_mult: null
        }))
    }

    render(){
        return(
            <div className="logReader">
                {this.state.log_data==null?
                    <div className="load">
                        <LogLoad
                            fileSelect={this.fileSelect}
                            title={"Выберите файл"}
                            type="single"
                        />
                    </div>:
                    <LogPlayer
                        log_data={this.state.log_data}
                        file_name={this.state.file_name}
                        refresh={this.refresh}
                        updateModal={this.props.updateModal}
                        log_type={this.state.log_type}
                    />
                }
            </div>
        )
    }
}

export default LogReader