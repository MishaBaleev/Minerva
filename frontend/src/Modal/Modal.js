import React, {Component} from "react";
import "./modal.css";

class Modal extends Component{
    constructor(props){
        super(props) 
    }

    render(){
        return(
            <div className="modal">
                <button className="close" onClick={() => {this.props.updateModal(false, {})}}></button>
                <p className="title">{this.props.title}</p>
                <p className="message">{this.props.message}</p>
            </div>
        )
    }
}

export default Modal