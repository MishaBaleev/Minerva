import { useState, useEffect } from "react";
import "./suppressor.scss";
import axios from "axios";
import refresh from "../Detector/Controls/img/refresh.png";

function Suppressor(props){
    const [act_sup, setSup] = useState("")
    const [ints, setInts] = useState([])
    const [act_auto, setAuto] = useState("")
    const int = ""

    function actSup(){
        if (act_sup == "active"){
            setSup("")
        }else{
            setSup("active")
        }
    }

    function actAuto(){
        if (act_auto == "active"){
            setAuto("")
        }else{
            setAuto("active")
        }
    }

    function getInts(){
        let ints = ["Неопределен"]
        axios.get("http://127.0.0.1:8000/getInts").then(response => {
            response.data.ints.forEach(item => {
                ints.push(item)
            })
            setInts(ints)
        })
    }

    function changeInt(e){
        int = e.target.value
        console.log(int)
    }

    useEffect(() => {
        getInts()
    }, [])

    return <div className="suppressor">
        <div className="block">
            <div className="interface">
                <button className={"act_sup "+act_sup} onClick={actSup}>
                    <div className={act_sup}></div>
                </button>
                <select className="act_int" onChange={changeInt} value={int}>
                    {ints.map((item, index) => {
                        return <option value={index} key={index}>{item}</option>
                    })}
                </select>
                <button className="act_refresh" onClick={getInts}>
                    <img src={refresh} alt="refresh"/>
                </button>
            </div>
            <div className="auto">
                <p className="title">Автоматическое подавление</p>
                <button className={"act_auto "+act_auto} onClick={actAuto}>
                    <div className={act_auto}></div>
                </button>
            </div>
        </div>
        <div className="split"/>
        <div className="block sup">
            <p className="title">Подавить</p>
            <div className="control">
                <button className="act_sup_moment"><div/></button>
                <div className="freq">
                    <p>Частота</p>
                    <input
                        type="number"
                        min={0}
                        max={2400}
                        step={1}
                        placeholder="0"
                    />
                </div>
            </div>
        </div>
    </div>
}

export default Suppressor