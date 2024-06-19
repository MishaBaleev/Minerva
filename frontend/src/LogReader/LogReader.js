import React, {Component} from "react";
import "./logReader.scss";
import LogPlayer2400 from "./LogPlayer2400/LogPlayer2400";
import LogPlayer915 from "./LogPlayer915/LogPlayer915";
import LogLoad from "./LogLoad/LogLoad";
import axios from "axios";
import LogPlayerSmall from "./LogPlayerSmall/LogPlayerSmall";
import LogPlayerMulti from "./LogPlayerMulti/LogPlayerMulti";
import LogPlayer5800 from "./LogPlayer5800/LogPlayer5800";

class LogReader extends Component{
    constructor(props){
        super(props)

        this.state = {
            log_data: null,
            log_dataSmall: null,
            file_name: "",
            log_type: null
        }

        this.fileSelect = this.fileSelect.bind(this)
        this.refresh = this.refresh.bind(this)
        this.fileSelectMulti = this.fileSelectMulti.bind(this)
    }

    fileSelect(e){
        let data = new FormData
        data.append("file", new Blob([e.target.files[0]]))
        axios.post("http://127.0.0.1:8000/getLogData", data).then(response => {
            console.log(response)
            if (response.data.result == false){
                this.props.updateModal(true, {title: "Ошибка открытия лога", message: "При открытии лога произошла ошибка"})
            }else{
                if (response.data.type == 2.4){
                    this.setState(state => ({
                        log_data: response.data.log_data,
                        file_name: e.target.files[0].name,
                        log_type: 2.4
                    }))
                }else if (response.data.type == 443){
                    this.setState(state => ({
                        log_data: response.data.log_data,
                        file_name: e.target.files[0].name,
                        log_type: 443
                    }))
                }else if (response.data.type == "multi"){
                    this.setState({
                        log_data: response.data.log_data,
                        file_name: e.target.files[0].name, 
                        log_type: "multi"
                    })
                }else if (response.data.type == 5800){
                    this.setState({
                        log_data: response.data.log_data,
                        file_name: e.target.files[0].name,
                        log_type: 5800
                    })
                }
            }
        })
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
                        log_dataSmall: {
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
            log_data: null,
            log_dataSmall: null,
            log_dataMulti: null,
            file_name: "",
            log_type: null
        }))
    }

    render(){
        return(
            <div className="logReader">
                {(this.state.log_data==null && this.state.log_dataSmall==null)?
                    <div className="load">
                        <LogLoad
                            fileSelect={this.fileSelect}
                            title={"Выберите файл"}
                            type="single"
                        />
                        <LogLoad
                            fileSelect={this.fileSelectMulti}
                            title={"Выберите несколько файлов"}
                            type="multi"
                        />
                    </div>
                    :""
                }           
                {(this.state.log_data!=null && this.state.log_type==2.4)?
                    <LogPlayer2400
                        log_data={this.state.log_data}
                        file_name={this.state.file_name}
                        refresh={this.refresh}
                        updateModal={this.props.updateModal}
                    />:""    
                }
                {(this.state.log_data!=null && this.state.log_type==443)?
                    <LogPlayer915
                        log_data={this.state.log_data}
                        file_name={this.state.file_name}
                        refresh={this.refresh}
                        updateModal={this.props.updateModal}
                    />:""    
                }
                {(this.state.log_data!= null && this.state.log_type=="multi")?
                    <LogPlayerMulti
                        log_data={this.state.log_data}
                        file_name={this.state.file_name}
                        refresh={this.refresh}
                        updateModal={this.props.updateModal}
                    />:""
                }
                {(this.state.log_data!=null && this.state.log_type==5800)?
                    <LogPlayer5800
                        log_data={this.state.log_data}
                        file_name={this.state.file_name}
                        refresh={this.refresh}
                        updateModal={this.props.updateModal}
                    />:""    
                }
                {this.state.log_dataSmall!=null?
                    <div className="mult_player">
                        <LogPlayerSmall
                            log_data={this.state.log_dataSmall.data_1}
                            file_name={this.state.log_dataSmall.file_name_1}
                            refresh={this.refresh}
                            updateModal={this.props.updateModal}
                            log_type={this.state.log_dataSmall.log_type_1}
                            is_first={true}
                        />
                        <LogPlayerSmall
                            log_data={this.state.log_dataSmall.data_2}
                            file_name={this.state.log_dataSmall.file_name_2}
                            refresh={this.refresh}
                            updateModal={this.props.updateModal}
                            log_type={this.state.log_dataSmall.log_type_2}
                            is_first={false}
                        />
                    </div>:""
                }
            </div>
        )
    }
}

export default LogReader