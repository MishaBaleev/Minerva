import React, {Component} from "react";
import "./loading.css";

class Loading extends Component{
    render(){
        return(
            <div className="loading">
                <p>Загрузка...</p>
                <div className="div div_1"></div>
                <div className="div div_2"></div>
            </div>
        )
    }
}

export default Loading