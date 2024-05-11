import React, {Component} from "react";
import "./logLoad.css";

class LogLoad extends Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div className="logLoad">
                <label className="input-file">
                    <input 
                        type="file" 
                        className="input" 
                        accept=".db" 
                        onChange={this.props.fileSelect}
                    />
                    <span>Выберите файл</span>
                </label>
            </div>
        )
    }
}

export default LogLoad