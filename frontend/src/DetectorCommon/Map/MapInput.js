import { useState, useEffect } from "react";

const MapInput = (props) => {
    const [params, setParams] = useState({
        x: 38.929787,
        y: 47.265274
    }) 
    const [azimuth, setAzimuth] = useState(0)

    const changeParam = (key, value) => {
        if (key === "azimuth"){
            props.mapManager.rotateSector(value)
            setAzimuth(value)
        }else{
            let new_params = {...params}
            new_params[key] = value 
            setParams(new_params)
        }
    }
    const clear = () => {
        setParams({
            x: 0,
            y: 0
        })
        setAzimuth(0)
        props.mapManager.clear()
    }
    const setDeviceMap = () => {
        if (props.map_mode === false){
            props.setDevice(params)
        }else{
            props.updateModal(true, {title:"Ошибка", message:"Чтобы поставить устройство на карте при помощи ручного ввода координат, переключите режим"})
        }
    }

    return <div className="map_input">
        <div className="block">
            <p className="title">Координата X:</p>
            <input type="number"
                value={params.x}
                step={0.1}
                onChange={(e) => {changeParam("x", e.target.value)}}
            />
        </div>
        <div className="block">
            <p className="title">Координата Y:</p>
            <input type="number"
                value={params.y}
                step={0.1}
                onChange={(e) => {changeParam("y", e.target.value)}}
            />
        </div>
        <div className="block">
            <p className="title">Азимут :</p>
            <input type="number" className="azimuth_number"
                placeholder="15"
                max={360}
                min={0}
                step={1}
                value={azimuth}
                onChange={(e) => {changeParam("azimuth", e.target.value)}}
            />
            <input type="range" className="azimuth_range"
                max={360}
                min={0}
                step={1}
                value={azimuth}
                onChange={(e) => {changeParam("azimuth", e.target.value)}}
            />
        </div>
        <button className="set_device" onClick={setDeviceMap}>Установить устройство</button>
        <div className="mode">
            <button className="change_mode" onClick={props.changeMapMode}>Сменить режим</button>
            <p className="title_mode">{props.map_mode?"На карте":"Координаты"}</p>
        </div>
        <button className="clear" onClick={clear}>Очистить</button>
    </div>
}

export default MapInput