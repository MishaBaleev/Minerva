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
                    {this.props.type=="single"?
                        <input 
                            type="file" 
                            className="input" 
                            accept=".db" 
                            onChange={this.props.fileSelect}
                        />:
                        <input 
                            type="file" 
                            name="filefield"
                            multiple="multiple"
                            className="input" 
                            accept=".db" 
                            onChange={this.props.fileSelect}
                        />
                    }
                    <span>{this.props.title}</span>
                </label>
            </div>
        )
    }
}

export default LogLoad