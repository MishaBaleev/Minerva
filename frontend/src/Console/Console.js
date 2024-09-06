import { useState, UseEffect, useEffect } from "react";
import "./console.scss";

function Console(props){
    return <div className={"console_data " + (props.is_big?"big":"small")}>
        {props.data.reverse().map((item, index) => {
            return <p key={index} className="line" title={item.data}>
                <span className="time">{item.time}</span>
                <span className="mes">{item.data.substring(0, 60)}...</span>
            </p>
        })}
    </div>
}

export default Console