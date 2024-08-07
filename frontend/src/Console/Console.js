import { useState, UseEffect } from "react";
import "./console.scss";

function Console(props){
    const cons_arr = []
    return <div className={"console_2400 " + (props.is_big?"big":"small")}>
        {props.data.reverse().map((item, index) => {
            return <p key={index} className="line" title={item.data}>
                <span className="time">{item.time}</span>
                <span className="mes">{item.data.substring(0, 60)}...</span>
            </p>
        })}
    </div>
}

export default Console